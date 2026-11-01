# Contact form

The contact form in `src/components/Contact.tsx` sends the visitor's email,
subject, and message directly to `https://api.web3forms.com/submit` over HTTPS.

Manage the receiving email address and form key through the Web3Forms account
that owns the configured access key. The browser form key is intended to be
public. No server API key or Vercel environment variable is required by this
contact form.

The privacy page at `/privacy` explains how enquiries are used and links to
Web3Forms' privacy policy.
