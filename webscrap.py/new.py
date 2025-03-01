import requests
import torch
import pandas as pd  # Import pandas for Excel export
from transformers import pipeline
from keybert import KeyBERT

# Force PyTorch to use CPU (Fix for Mac MPS issue)
device = torch.device("cpu")

# Load AI models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", framework="pt", device=-1)  # Use CPU
keyword_extractor = KeyBERT()

# Prepare a dictionary to store data for multiple sheets
all_event_data = {}

def fetch_ticketmaster_events(city, genre, max_events=10):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": "lqyN0tq0IV2yKAHJ0Aun9L0rGdt4hjcI",
        "city": city,
        "classificationName": genre,
        "locale": "en-us",
        "size": max_events
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if "_embedded" not in data or "events" not in data["_embedded"]:
            print(f"❌ No events found for {genre} in {city}.")
            return []

        events = data["_embedded"]["events"]
        event_details = []

        for event in events:
            name = event.get("name", "No Event Name")
            date = event.get("dates", {}).get("start", {}).get("localDate", "No Date Available")
            venue = event.get("_embedded", {}).get("venues", [{}])[0].get("name", "No Venue Available")
            address = event.get("_embedded", {}).get("venues", [{}])[0].get("address", {}).get("line1", "No Address Available")
            zipcode = event.get("_embedded", {}).get("venues", [{}])[0].get("postalCode", "No ZIP Code Available")
            genre = event.get("classifications", [{}])[0].get("segment", {}).get("name", "No Genre Available")
            ticket_url = event.get("url", "No Ticket URL Available")
            organizer = event.get("promoter", {}).get("name", "No Organizer Available")
            image_url = event.get("images", [{}])[0].get("url", "No Image Available")

            # Generate AI-based description
            ai_description = generate_ai_description(name, date, venue, address, zipcode, genre, organizer)
            keywords = generate_keywords(f"{name} {date} {genre} {venue}")

            event_details.append({
                "Name": name,
                "Date": date,
                "Venue": venue,
                "Address": address,
                "ZIP Code": zipcode,
                "Genre": genre,
                "Organizer": organizer,
                "AI Description": ai_description,
                "Keywords": keywords,
                "Ticket URL": ticket_url,
                "Image URL": image_url
            })

        # Store data in the dictionary for multiple sheets
        sheet_name = f"{city}_{genre}"
        all_event_data[sheet_name] = pd.DataFrame(event_details)

        return event_details

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to fetch Ticketmaster events: {e}")
        return []

def generate_ai_description(name, date, venue, address, zipcode, genre, organizer):
    prompt = f"""
    Event: {name}
    Date: {date}
    Venue: {venue}
    Address: {address}, ZIP Code: {zipcode}
    Genre: {genre}
    Organizer: {organizer}
    Generate a short and engaging 2-sentence event description.
    """
    try:
        summary = summarizer(prompt, max_length=50, min_length=10, do_sample=False)[0]['summary_text']
        return summary
    except Exception as e:
        print(f"❌ AI failed to generate description: {e}")
        return "No Description Available"

def generate_keywords(text):
    keywords = keyword_extractor.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=5)
    return ", ".join([kw[0] for kw in keywords])

def save_to_single_excel():
    """Save all event details to a single Excel file with multiple sheets."""
    with pd.ExcelWriter("All_Events_Details.xlsx", engine='openpyxl') as writer:
        for sheet_name, df in all_event_data.items():
            df.to_excel(writer, sheet_name=sheet_name, index=False)
    print("📁 All event details saved to All_Events_Details.xlsx")

# Predefined cities and genres
cities = ["Chicago", "New York", "Austin", "Boston", "Houston", "Dallas", "Miami"]
genres = ["Miscellaneous", "Seminar", "Sports", "Music", "Family"]

# Fetch and save events for each city and genre combination
for city in cities:
    for genre in genres:
        print(f"\n📌 Fetching events for {genre} in {city}...")
        fetch_ticketmaster_events(city, genre, max_events=10)

# Save all collected data into a single Excel file
save_to_single_excel()

print("✅ All events fetched and saved successfully!")
