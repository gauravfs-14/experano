import requests
import torch
from transformers import pipeline
from keybert import KeyBERT

# Force PyTorch to use CPU (Fix for Mac MPS issue)
device = torch.device("cpu")

# Load AI models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", framework="pt", device=-1)  # Use CPU
keyword_extractor = KeyBERT()

# Mapping Ticketmaster genres to segment IDs
segment_ids = {
    "Music": "KZFzniwnSyZfZ7v7nJ",
    "Sports": "KZFzniwnSyZfZ7v7nE",
    "Arts & Theater": "KZFzniwnSyZfZ7v7na",
    "Family": "KZFzniwnSyZfZ7v7n1",
    "Comedy": "KZFzniwnSyZfZ7v7nA",
    "Miscellaneous": "KZFzniwnSyZfZ7v7n7",
    "Education": "KZFzniwnSyZfZ7v7nI"
}

def fetch_ticketmaster_events(city, genre, max_events=10):
    """Fetches event details from Ticketmaster API based on city and genre."""
    
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    
    # Use segment ID if available, else fallback to classification name
    segment_id = segment_ids.get(genre, None)
    
    params = {
        "apikey": "lqyN0tq0IV2yKAHJ0Aun9L0rGdt4hjcI",  # Replace with your API Key
        "city": city,
        "size": max_events
    }

    if segment_id:
        params["segmentId"] = segment_id
    else:
        params["classificationName"] = genre  # Fallback if segment ID not found

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if "_embedded" not in data or "events" not in data["_embedded"]:
            print(f"❌ No events found for '{genre}'. Try another genre.")
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

            # Extract event image
            image_url = event.get("images", [{}])[0].get("url", "No Image Available")

            # Generate AI-based description
            ai_description = generate_ai_description(name, date, venue, address, zipcode, genre, organizer)

            # Generate AI-based keywords
            keywords = generate_keywords(f"{name} {date} {genre} {venue}")

            event_details.append({
                "name": name,
                "date": date,
                "venue": venue,
                "address": address,
                "zipcode": zipcode,
                "genre": genre,
                "organizer": organizer,
                "ai_description": ai_description,
                "keywords": keywords,
                "ticket_url": ticket_url,
                "image_url": image_url
            })

        return event_details

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to fetch Ticketmaster events: {e}")
        return []

def generate_ai_description(name, date, venue, address, zipcode, genre, organizer):
    """Generates a short and engaging AI-based event description."""
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
    """Extracts relevant keywords using KeyBERT."""
    keywords = keyword_extractor.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=5)
    return ", ".join([kw[0] for kw in keywords])

# Get user input
city = input("Enter city name (e.g., Austin, New York, Los Angeles): ").strip().title()
genre = input("Enter event genre (e.g., Music, Sports, Theater, Family, Education, etc.): ").strip().title()

# Fetch events
events = fetch_ticketmaster_events(city, genre, max_events=10)

# Print event details
if events:
    print("\n🎟️ Event Details:")
    for event in events:
        print(f"\n🎵 Event: {event['name']}")
        print(f"📅 Date: {event['date']}")
        print(f"📍 Venue: {event['venue']}")
        print(f"📌 Address: {event['address']}, ZIP Code: {event['zipcode']}")
        print(f"🔖 Genre: {event['genre']}")
        print(f"👤 Organizer: {event['organizer']}")
        print(f"📝 AI-Generated Description: {event['ai_description']}")
        print(f"🔑 Keywords: {event['keywords']}")
        print(f"🖼️ Image: {event['image_url']}")
        print(f"🎟️ Ticket URL: {event['ticket_url']}")
        print("=" * 100)
else:
    print("❌ No events found.")
