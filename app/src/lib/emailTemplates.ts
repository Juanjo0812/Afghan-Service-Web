/**
 * Email templates for Catholic Charities Afghan Migration Services.
 * Provides high-fidelity, responsive HTML emails aligned with the site's identity.
 */

interface EventRegistrationEmailProps {
  logoUrl: string
  name: string
  eventTitle: string
  contactMethod: string
  contactValue: string
  langLabel: string
}

interface ContactEmailProps {
  logoUrl: string
  name: string
  phone: string
  email?: string
  message: string
}

export function generateEventRegistrationEmail({
  logoUrl,
  name,
  eventTitle,
  contactMethod,
  contactValue,
  langLabel,
}: EventRegistrationEmailProps): string {
  const contactMethodLabel = contactMethod === 'phone' ? 'Phone' : 'Email'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Registration Request</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #FDFCF7;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #FDFCF7;
      padding: 30px 15px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #E6E4DB;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(26, 37, 24, 0.02);
    }
    .header {
      background-color: #1A2518;
      padding: 24px;
      text-align: center;
      border-bottom: 3px solid #D97706;
    }
    .logo {
      height: 44px;
      width: auto;
      vertical-align: middle;
      filter: brightness(0) invert(1);
      -webkit-filter: brightness(0) invert(1);
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #1A2518;
      margin-top: 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #F1EFEB;
      padding-bottom: 15px;
    }
    .lead-text {
      font-size: 16px;
      line-height: 1.6;
      color: #384B35;
      margin-bottom: 30px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      background-color: #FAF9F5;
      border-radius: 8px;
      overflow: hidden;
    }
    .details-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #F1EFEB;
    }
    .details-table tr:last-child td {
      border-bottom: none;
    }
    .label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #D97706;
      width: 35%;
    }
    .value {
      font-size: 15px;
      color: #1A2518;
      font-weight: 500;
    }
    .footer {
      background-color: #FAF9F5;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #E6E4DB;
    }
    .footer-text {
      font-size: 12px;
      color: #8C968A;
      margin: 0 0 8px 0;
    }
    .highlight-badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: #EBF3EA;
      color: #2F4D2C;
      font-size: 12px;
      font-weight: 600;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="Catholic Charities Logo" class="logo">
      </div>
      <div class="content">
        <h1 class="title">Event Registration Request</h1>
        <p class="lead-text">
          Hello, a new event registration request has been submitted. The details of the registrant are provided below:
        </p>
        <table class="details-table">
          <tr>
            <td class="label">Event Name</td>
            <td class="value" style="font-weight: 600; color: #1A2518;">${eventTitle}</td>
          </tr>
          <tr>
            <td class="label">Participant</td>
            <td class="value">${name}</td>
          </tr>
          <tr>
            <td class="label">Preferred Contact</td>
            <td class="value">
              <span class="highlight-badge">${contactMethodLabel}</span>
            </td>
          </tr>
          <tr>
            <td class="label">Contact Detail</td>
            <td class="value" style="font-family: monospace; font-size: 16px;">${contactValue}</td>
          </tr>
        </table>
      </div>
      <div class="footer">
        <p class="footer-text">This message was automatically generated from the Catholic Charities Phoenix Afghan Support platform.</p>
        <p class="footer-text" style="font-style: italic; margin-bottom: 0;">Submission language: ${langLabel}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

export function generateContactEmail({
  logoUrl,
  name,
  phone,
  email,
  message,
}: ContactEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #FDFCF7;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #FDFCF7;
      padding: 30px 15px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #E6E4DB;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(26, 37, 24, 0.02);
    }
    .header {
      background-color: #1A2518;
      padding: 24px;
      text-align: center;
      border-bottom: 3px solid #D97706;
    }
    .logo {
      height: 44px;
      width: auto;
      vertical-align: middle;
      filter: brightness(0) invert(1);
      -webkit-filter: brightness(0) invert(1);
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #1A2518;
      margin-top: 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #F1EFEB;
      padding-bottom: 15px;
    }
    .lead-text {
      font-size: 16px;
      line-height: 1.6;
      color: #384B35;
      margin-bottom: 30px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      background-color: #FAF9F5;
      border-radius: 8px;
      overflow: hidden;
    }
    .details-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #F1EFEB;
    }
    .details-table tr:last-child td {
      border-bottom: none;
    }
    .label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #D97706;
      width: 30%;
    }
    .value {
      font-size: 15px;
      color: #1A2518;
      font-weight: 500;
    }
    .message-box {
      background-color: #FAF9F5;
      border-left: 4px solid #1A2518;
      padding: 20px;
      border-radius: 8px;
      font-size: 15px;
      line-height: 1.6;
      color: #2C3E2B;
      margin-top: 10px;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #FAF9F5;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #E6E4DB;
    }
    .footer-text {
      font-size: 12px;
      color: #8C968A;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="Catholic Charities Logo" class="logo">
      </div>
      <div class="content">
        <h1 class="title">New Contact Inquiry</h1>
        <p class="lead-text">
          A new message has been received from the website contact form. The details are provided below:
        </p>
        <table class="details-table">
          <tr>
            <td class="label">Sender Name</td>
            <td class="value">${name}</td>
          </tr>
          <tr>
            <td class="label">Phone</td>
            <td class="value" style="font-family: monospace; font-size: 15px;">${phone}</td>
          </tr>
          ${email ? `
          <tr>
            <td class="label">Email</td>
            <td class="value">${email}</td>
          </tr>
          ` : ''}
        </table>
        
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #D97706; margin-top: 30px; margin-bottom: 10px;">Message Content</h3>
        <div class="message-box">${message}</div>
      </div>
      <div class="footer">
        <p class="footer-text">This message was automatically generated from the Catholic Charities Phoenix Afghan Support platform.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
