# Google Sheets Integration Setup

To connect the waitlist form to Google Sheets, follow these steps:

## 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Two Fifths Playbook Waitlist"
4. Add headers in row 1: `Email`, `Timestamp`, `Source`

## 2. Create Google Apps Script
1. In your Google Sheet, go to `Extensions` > `Apps Script`
2. For the waitlist, add headers: `Email`, `Timestamp`, `Source`
3. For the next steps form, add headers: `Name`, `Email`, `Company`, `Challenge`, `Timestamp`, `Source`
4. Replace the default code with:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = e.parameter;
    
    // Handle different form types
    if (data.source === 'playbook-waitlist') {
      sheet.appendRow([
        data.email,
        data.timestamp,
        data.source
      ]);
    } else if (data.source === 'next-steps-form') {
      sheet.appendRow([
        data.name,
        data.email,
        data.company,
        data.challenge,
        data.timestamp,
        data.source
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Deploy the Script
1. Click `Deploy` > `New deployment`
2. Choose type: `Web app`
3. Execute as: `Me`
4. Who has access: `Anyone`
5. Click `Deploy`
6. Copy the Web app URL

## 4. Update the Code
Replace `YOUR_SCRIPT_ID` in the PlaybookDownload component with your actual script URL.
Also update the same URL in the NextSteps component.

## 5. Test
Try submitting the form to ensure emails are being captured in your Google Sheet.

## Security Note
This setup allows anyone to submit to your form. For production use, consider adding:
- Rate limiting
- Email validation
- CAPTCHA protection
- Authentication if needed