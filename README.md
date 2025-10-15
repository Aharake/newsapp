# News Hub App

Hey! This is a simple news app I built using React Native and Expo. It pulls articles from the GNews API and lets you browse, search, and find news stories.

## What it does

- Browse news articles (you can choose how many to load)
- Search for articles by keywords
- Find articles by title or author
- Filter articles by date (today, this week, this year, or all time)
- Clean, simple design with a light blue theme
- Smooth animations when you scroll

## How to run it

### What you need first

- Node.js installed on your computer
- A phone with the Expo Go app (download from App Store or Google Play)
- OR an Android/iOS emulator if you prefer

### Steps to get it running

1. **Install everything**
   ```bash
   cd news-app
   npm install
   ```

2. **Get an API key**
   - Go to https://gnews.io/ and sign up (it's free)
   - Copy your API key
   - Open `src/services/newsService.js` and paste your key where it says `YOUR_GNEWS_API_KEY_HERE`

3. **Start the app**
   ```bash
   npm start
   ```

4. **Open it on your phone**
   - Scan the QR code with your phone's camera (iPhone) or Expo Go app (Android)
   - Or press `i` for iOS simulator or `a` for Android emulator

## How to use it

It's pretty straightforward:

- **Browse tab**: Pick how many articles you want (5, 10, 20, or 50) and hit fetch
- **Search tab**: Type in keywords and search for articles about that topic
- **Find tab**: Look for articles by their exact title or author name

You can also filter by date using the dropdown - useful if you only want recent news.

## A few notes

- The free GNews API only gives you 100 requests per day, so don't go crazy clicking fetch
- Sometimes if you search for something super specific, you might not get results
- The date filter works on the articles you've already loaded, so fetch first then filter

## What I used

- React Native with Expo
- GNews API for the news data
- Some animation libraries to make it look nice
- That's about it, kept it simple

## If something breaks

- Make sure you put in your actual API key (don't leave the placeholder)
- Check your internet connection
- If you hit the API limit, wait until tomorrow or get a paid plan

That's it! Let me know if you run into any issues.
