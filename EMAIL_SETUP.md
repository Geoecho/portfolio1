# Email Setup Instructions

## Current Status
The contact form is configured to send emails to **hbristik@gmail.com** using Resend API.

## To Enable Email Sending

### 1. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard

### 2. Set Environment Variable
Create a `.env` file in the project root:

```env
RESEND_API_KEY=your_api_key_here
```

### 3. Deploy Configuration
When deploying (e.g., to Vercel):
- Add `RESEND_API_KEY` to your environment variables in the deployment settings
- The API endpoint at `/api/send-email` will automatically work

## How It Works
- Form submits to `/api/send-email`
- API handler in `api/send-email.ts` uses Resend to send email
- Success shows red confirmation with checkmark
- Error shows error message

## Testing Locally
The API endpoint needs to be served. If using Vite, you may need to:
1. Deploy to Vercel/Netlify (recommended)
2. Or set up a local API proxy

The form UI will work and show proper feedback states even without the backend running.
