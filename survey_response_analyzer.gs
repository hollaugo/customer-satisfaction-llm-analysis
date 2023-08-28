// Access OPENAI_API_KEY and SLACK_WEBHOOK_URL from the script properties
const OPENAI_API_KEY = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
const SLACK_WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');

// Function to be triggered when the form is submitted
function onFormSubmit(e) {
  // Get the submitted data
  const { values, range } = e;
  const [timestamp, email, productType, overallRating, customerServiceRating, feedback] = values;
  
  // Craft a prompt for GPT-4
  const prompt = `Analyze the following customer feedback and return the analysis as a JSON object including:
  1. "Sentiment": Overall sentiment (Positive, Neutral, Negative)
  2. "Tags": Relevant tags 🏷️
  3. "KeyTakeaway": Key takeaways 📝
  4. "ActionItems": Action items and/or suggested recommendations 🛠️
  
  Feedback: ${feedback}`;

  // Analyze the feedback if present
  if (feedback) {
    const analysisJSON = callGPTToAnalyzeFeedback(prompt);
    
    // Parse the JSON analysis
    const analysisObj = JSON.parse(analysisJSON);
    
    // Send the analysis to Slack with formatting and emojis
    sendToSlack(analysisObj, email);
    
    // Update the Google Sheet with tags and categories
    updateSheetWithTag(range, analysisObj);
  }
}

// Function to call GPT4 to analyze the feedback
function callGPTToAnalyzeFeedback(prompt) {
  const url = "https://api.openai.com/v1/chat/completions";
  const payload = {
    "model": "gpt-4-0613",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant helping to provide analysis on survey results, Results are to be passed to Slack via a Slack message which should be consice and focus on key itemized bullet points"},
      {"role": "user", "content": prompt}
    ]
  };

  const params = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    "payload": JSON.stringify(payload)
  };

  try {
    const response = UrlFetchApp.fetch(url, params);
    const jsonResponse = JSON.parse(response.getContentText());
    return jsonResponse.choices[0].message.content.trim();
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

// Function to send the analysis to Slack
// Function to send the analysis to Slack
function sendToSlack(analysisObj, email) {
  const sentiment = analysisObj.Sentiment;
  const tags = analysisObj.Tags.join(", ");
  const keyTakeaway = analysisObj.KeyTakeaway;
  const actionItems = analysisObj.ActionItems.join(", ");

  const payload = {
    "text": `🌟 *New Feedback Analysis* 🌟
    
👤 *From*: ${email}

📊 *Analysis*: 
- *Sentiment*: ${sentiment}
- *Tags*: ${tags}
- *Key Takeaway*: ${keyTakeaway}
- *Action Items*: ${actionItems}`
  };

  const params = {
    "method": "post",
    "payload": JSON.stringify(payload)
  };

  try {
    UrlFetchApp.fetch(SLACK_WEBHOOK_URL, params);
  } catch (error) {
    console.error(`Error sending to Slack: ${error.message}`);
  }
}


// Function to update the Google Sheet with tags and categories
function updateSheetWithTag(range, analysisObj) {
  const sheet = range.getSheet();
  const row = range.getRow();
  
  // Update the Google Sheet in new columns
  sheet.getRange(`G${row}`).setValue(analysisObj.Sentiment);
  sheet.getRange(`H${row}`).setValue(analysisObj.Tags.join(', '));
  sheet.getRange(`I${row}`).setValue(analysisObj.KeyTakeaway);
  sheet.getRange(`J${row}`).setValue(analysisObj.ActionItems.join(', '));
}
