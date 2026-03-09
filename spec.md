# AR Esports - Free Fire MAX Tournament Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Home page with AR Esports branding, daily tournament schedule, entry fees, prize pools, register CTA, footer credit
- Tournament registration page with login/signup wall (name, email, age fields + principal-based auth)
- Registration form: Free Fire MAX UID, Game Name, Phone Number, Email, Team Member Details, UPI ID or Instagram ID
- Payment flow: show QR code image + UPI ID (8317701193@ybl), instruction to verify receiver name "Purushottam Kumar", "I Have Paid / Check Payment" button
- Admin panel (password: adarshwebmaker) with all users, registrations, payment approval requests, approve/reject controls
- User history page (accessible via 3-dot menu): past tournaments, registration details
- Duplicate protection: block re-registration for same match
- Success celebration animation (confetti/party popper) on approved payment
- Contact section: Instagram handles @a0arsh, @rahul373, @arpita_gaming27
- Footer: "All rights reserved by Arpita, Adarsh, Rahul" + "Credit: Adarsh"
- Dark gaming theme, neon glow effects, esports fonts, mobile-friendly

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - User store: principal → {name, email, age, createdAt}
   - Tournament store: fixed daily schedule (11AM 2v2, 1PM 4v4, 4PM 2v2, 8PM 4v4)
   - Registration store: {id, userId, tournamentSlot, ffUID, gameName, phone, email, teamMembers, upiOrInsta, status: pending|approved|rejected, createdAt}
   - Admin functions: login check (password hash), getAll registrations, approvePayment, rejectPayment
   - Duplicate check: one registration per user per slot per day
   - User profile save/get

2. Frontend:
   - Home page: hero section, schedule table, fees/prizes, register CTA
   - Auth page: signup (name/email/age) + Internet Identity login
   - Registration page: slot selector, form, QR code display, payment confirmation
   - Admin panel: password-gated, tabs for users/registrations/approvals
   - User history: list past registrations with status
   - Confetti animation on payment approval
   - Dark neon gaming theme throughout
