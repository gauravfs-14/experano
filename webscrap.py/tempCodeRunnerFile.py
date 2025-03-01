import requests
from transformers import pipeline

# Ticketmaster API Key (Replace with yours)
TICKETMASTER_API_KEY = "lqyN0tq0IV2yKAHJ0Aun9L0rGdt4hjcI"

# Load free AI model for text generation
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Function to fetch events from Ticketmaster API
def fetch_ticketmaster_events(city, genre, max_events=10):
    """Fetches event details from Ticketmaster API based on city and genre."""
    
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": TICKETMASTER_API_KEY,
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
            print("❌ No events found for the given city and genre.")
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

            # Generate AI-based description
            ai_description = generate_ai_description(name, date, venue, address, zipcode, genre)

            event_details.append({
                "name": name,
                "date": date,
                "venue": venue,
                "address": address,
                "zipcode": zipcode,
                "genre": genre,
                "ai_description": ai_description,
                "ticket_url": ticket_url
            })

        return event_details

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to fetch Ticketmaster events: {e}")
        return []

# Function to generate AI-based short description
def generate_ai_description(name, date, venue, address, zipcode, genre):
    """Uses Hugging Face Transformer model to generate a short event description."""
    
    prompt = f"""
    Event: {name}
    Date: {date}
    Venue: {venue}
    Address: {address}, ZIP Code: {zipcode}
    Genre: {genre}
    Generate a short and engaging 2-sentence event description.
    """

    try:
        summary = summarizer(prompt, max_length=50, min_length=10, do_sample=False)
        return summary[0]['summary_text']
    
    except Exception as e:
        print(f"❌ AI failed to generate description: {e}")
        return "No Description Available"

# Get user input
city = input("Enter city name (e.g., Austin, New York, Los Angeles): ").strip().title()
genre = input("Enter event genre (e.g., Music, Sports, Theater, etc.): ").strip().title()

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
        print(f"📝 AI-Generated Description: {event['ai_description']}")
        print(f"🎟️ Ticket URL: {event['ticket_url']}")
        print("=" * 100)
else:
    print("❌ No events found.")
