import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    return;
  }

  const { email, heading, message } = req.body as {
    email?: string;
    heading?: string;
    message?: string;
  };

  const subject = heading || 'Portfolio contact';
  const toAddress = 'hbristik@gmail.com';

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: toAddress,
      reply_to: email && email.trim() ? email.trim() : undefined,
      subject,
      text: `From: ${email || 'visitor'}\n\n${message || ''}`,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
