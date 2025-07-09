/**
 * Google Apps Script Web App for handling form submissions
 * This script should be deployed as a web app in Google Apps Script
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Deploy as a web app with execute permissions set to "Anyone"
 * 5. Copy the web app URL and use it in your form submissions
 */

function doPost(e) {
  try {
    // Parse the form data
    const formData = e.parameter;
    
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Determine the form type and process accordingly
    if (formData.source === 'next-steps-form') {
      handleNextStepsForm(formData, sheet);
    } else if (formData.source === 'playbook-waitlist') {
      handlePlaybookWaitlist(formData, sheet);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Send error notification email
    sendErrorNotification(error, e.parameter);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleNextStepsForm(formData, sheet) {
  // Add to spreadsheet
  const row = [
    new Date(),
    formData.name || '',
    formData.email || '',
    formData.company || '',
    formData.challenge || '',
    'Next Steps Form',
    formData.timestamp || ''
  ];
  
  sheet.appendRow(row);
  
  // Send email notification
  sendNextStepsNotification(formData);
}

function handlePlaybookWaitlist(formData, sheet) {
  // Add to spreadsheet
  const row = [
    new Date(),
    formData.name || 'Playbook Waitlist Signup',
    formData.email || '',
    formData.company || 'ANZ Expansion Interest',
    formData.challenge || 'Requested early access to ANZ Expansion Playbook',
    formData.formType || 'Playbook Waitlist',
    formData.timestamp || ''
  ];
  
  sheet.appendRow(row);
  
  // Send email notification
  sendPlaybookWaitlistNotification(formData);
}

function sendNextStepsNotification(formData) {
  const recipient = 'jason@twofifthsfractional.com';
  const subject = `New Partnership Inquiry from ${formData.name || 'Unknown'}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #c4374f; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Partnership Inquiry</h1>
        <p style="margin: 5px 0 0 0;">Two-Fifths Website Contact Form</p>
      </div>
      
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #c4374f; margin-top: 0;">Contact Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${formData.name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <a href="mailto:${formData.email}" style="color: #c4374f;">${formData.email || 'Not provided'}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Company:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${formData.company || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Challenge:</td>
            <td style="padding: 10px 0;">${formData.challenge || 'Not provided'}</td>
          </tr>
        </table>
      </div>
      
      <div style="padding: 20px; background-color: #fff; border-top: 3px solid #c4374f;">
        <h3 style="color: #c4374f; margin-top: 0;">Quick Actions</h3>
        <p style="margin-bottom: 15px;">
          <a href="mailto:${formData.email}?subject=Re: Partnership Inquiry&body=Hi ${formData.name || 'there'},%0D%0A%0D%0AThank you for reaching out about partnership opportunities..." 
             style="background-color: #c4374f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reply to ${formData.name || 'Contact'}
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          <strong>Submitted:</strong> ${new Date(formData.timestamp).toLocaleString('en-AU', { 
            timeZone: 'Australia/Melbourne',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })} (Melbourne time)
        </p>
      </div>
    </div>
  `;
  
  const plainBody = `
New Partnership Inquiry - Two-Fifths Website

Contact Details:
Name: ${formData.name || 'Not provided'}
Email: ${formData.email || 'Not provided'}
Company: ${formData.company || 'Not provided'}

Partnership Challenge:
${formData.challenge || 'Not provided'}

Submitted: ${new Date(formData.timestamp).toLocaleString('en-AU', { 
  timeZone: 'Australia/Melbourne'
})} (Melbourne time)

Reply to this inquiry: ${formData.email}
  `;
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody,
    replyTo: formData.email
  });
}

function sendPlaybookWaitlistNotification(formData) {
  const recipient = 'jason@twofifthsfractional.com';
  const subject = `📚 ANZ Playbook Waitlist: ${formData.email}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #c4374f; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">📚 ANZ Playbook Waitlist</h1>
        <p style="margin: 5px 0 0 0;">New Signup from Two-Fifths Website</p>
      </div>
      
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #c4374f; margin-top: 0;">Waitlist Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <a href="mailto:${formData.email}" style="color: #c4374f;">${formData.email || 'Not provided'}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Submitted:</td>
            <td style="padding: 10px 0;">${new Date(formData.timestamp).toLocaleString('en-AU', { 
              timeZone: 'Australia/Melbourne',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} (Melbourne time)</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Source:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">International SaaS Services Section</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Interest:</td>
            <td style="padding: 10px 0;">ANZ Expansion Playbook - Early Access</td>
          </tr>
        </table>
      </div>
      
      <div style="padding: 20px; background-color: #fff; border-top: 3px solid #c4374f;">
        <h3 style="color: #c4374f; margin-top: 0;">Next Steps</h3>
        <p style="margin-bottom: 15px;">
          <a href="mailto:${formData.email}?subject=ANZ Expansion Playbook - Early Access&body=Hi there,%0D%0A%0D%0AThank you for joining the waitlist for the ANZ Expansion Playbook!%0D%0A%0D%0AI'll notify you as soon as it's ready for download.%0D%0A%0D%0ABest regards,%0D%0AJason Cormier%0D%0ATwo-Fifths Fractional" 
             style="background-color: #c4374f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Send Confirmation Email
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          <strong>Action:</strong> Add ${formData.email} to your ANZ Playbook notification list. 
          Send them the download link when the playbook is ready.
        </p>
      </div>
    </div>
  `;
  
  const plainBody = `
ANZ Playbook Waitlist Signup - Two-Fifths Website

Email: ${formData.email || 'Not provided'}
Source: International SaaS Services Section
Interest: ANZ Expansion Playbook - Early Access

Submitted: ${new Date(formData.timestamp).toLocaleString('en-AU', { 
  timeZone: 'Australia/Melbourne'
})} (Melbourne time)

ACTION: Add ${formData.email} to your ANZ Playbook notification list.
Send them the download link when the playbook is ready.

Reply to: ${formData.email}
  `;
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody,
    replyTo: formData.email
  });
}

function sendErrorNotification(error, formData) {
  const recipient = 'jason@twofifthsfractional.com';
  const subject = 'Two-Fifths Website Form Error';
  
  const body = `
Error processing form submission on Two-Fifths website:

Error: ${error.toString()}

Form Data Received:
${JSON.stringify(formData, null, 2)}

Time: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })} (Melbourne time)

Please check the Google Apps Script logs for more details.
  `;
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: body
  });
}

function getOrCreateSpreadsheet() {
  const spreadsheetName = 'Two-Fifths Website Submissions';
  
  // Try to find existing spreadsheet
  const files = DriveApp.getFilesByName(spreadsheetName);
  
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  } else {
    // Create new spreadsheet
    const spreadsheet = SpreadsheetApp.create(spreadsheetName);
    const sheet = spreadsheet.getActiveSheet();
    
    // Add headers
    sheet.getRange(1, 1, 1, 7).setValues([[
      'Timestamp', 'Name', 'Email', 'Company', 'Challenge/Message', 'Form Type', 'Original Timestamp'
    ]]);
    
    // Format headers
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    sheet.getRange(1, 1, 1, 7).setBackground('#c4374f');
    sheet.getRange(1, 1, 1, 7).setFontColor('white');
    
    return spreadsheet;
  }
}

// Test function - you can run this to test email functionality
function testEmailNotification() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    challenge: 'This is a test submission to verify email notifications are working.',
    timestamp: new Date().toISOString(),
    source: 'next-steps-form'
  };
  
  sendNextStepsNotification(testData);
  console.log('Test email sent!');
}