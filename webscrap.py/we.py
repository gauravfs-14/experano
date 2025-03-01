import requests
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

CHROME_DRIVER_PATH = "/usr/local/bin/chromedriver"
# Correct path to ChromeDriver
  # Ensure this path is correct

# Check if the path is correct
import os
if not os.path.isfile(CHROME_DRIVER_PATH):
    print(f"❌ ChromeDriver not found at: {CHROME_DRIVER_PATH}")
    exit()

# Setup Chrome options
options = Options()
options.add_argument("--headless")  # Run in headless mode (no browser UI)
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Initialize Chrome driver
service = Service(CHROME_DRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)

# URL to scrape
url = "https://www.eventbrite.com/d/united-states--texas/education/"
driver.get(url)
time.sleep(3)

# Extract event details
events = driver.find_elements(By.CLASS_NAME, 'eds-event-card-content__content')

event_details = []
for event in events:
    try:
        name = event.find_element(By.CLASS_NAME, 'eds-event-card-content__title').text
        date = event.find_element(By.CLASS_NAME, 'eds-event-card-content__sub-title').text
        location = event.find_element(By.CLASS_NAME, 'card-text--truncated__one').text
        link = event.find_element(By.TAG_NAME, 'a').get_attribute('href')

        event_details.append({
            'Name': name,
            'Date': date,
            'Location': location,
            'Link': link
        })

    except Exception as e:
        print(f"Error extracting event: {e}")

# Close the driver
driver.quit()

# Print event details to terminal
for event in event_details:
    print(f"📅 Name: {event['Name']}")
    print(f"📅 Date: {event['Date']}")
    print(f"📍 Location: {event['Location']}")
    print(f"🔗 Link: {event['Link']}")
    print("=" * 100)

# Save to Excel
df = pd.DataFrame(event_details)
df.to_excel("Eventbrite_Education_Events.xlsx", index=False)
print("📁 Data saved to Eventbrite_Education_Events.xlsx")
