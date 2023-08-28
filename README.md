# Customer Satisfaction Survey Analyzer using Google App Script, GPT-4, and Slack

## Overview 🌟
This solution provides an automated way to analyze customer feedback collected through Google Forms, analyze it using GPT-4, and then send the results to Slack. Additionally, it updates the Google Sheet that collects the survey responses with tags based on the analysis.

## Features 📊
- Automated analysis of customer satisfaction survey
- Slack notification with parsed analysis
- Spreadsheet update with categorized tags

## Tech Stack 🛠️
- Google App Script for automation
- GPT-4 for natural language processing
- Slack for notifications

## Dependencies 📦
1. `OPENAI_API_KEY`: Your OpenAI API key stored in Google Script Properties
2. `SLACK_WEBHOOK_URL`: Your Slack Webhook URL stored in Google Script Properties

## Setup 🚀

### Google App Script
1. Open your Google Sheet for collecting survey responses.
2. Go to Extensions -> App Script to open the script editor.
3. Copy the entire code into the editor.
4. Save the script.

### Script Properties
1. Go to File -> Project Properties -> Script Properties.
2. Add a new property `OPENAI_API_KEY` and set it as your OpenAI API key.
3. Add another property `SLACK_WEBHOOK_URL` and set it as your Slack Webhook URL.

### Slack
1. Create a new incoming Webhook in your Slack workspace and get the Webhook URL.
2. Update the `SLACK_WEBHOOK_URL` in the Google Script Properties.

### Trigger Setup
1. In the App Script editor, go to Triggers.
2. Add a new trigger for the `onFormSubmit` function.
3. Choose the event type as 'On form submit'.

## Usage 💡
Once set up, the script will automatically trigger every time a form response is submitted. It will analyze the feedback, send a summary to Slack, and update the Google Sheet with tags like "Positive 😃", "Negative 😞", etc.

## Credits 🙏
- GPT-4 by OpenAI for the powerful natural language processing
- Slack for enabling real-time notifications
- Google App Script for automation and Google Sheets API
