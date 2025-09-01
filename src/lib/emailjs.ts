// src/lib/emailjs.ts
import emailjs from '@emailjs/browser'

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

export function sendVerificationEmail({
  email,
  verification_link,
}: {
  email: string
  verification_link: string
}) {
  return emailjs.send('default_service', import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
    email,
    verification_link,
  })
}
