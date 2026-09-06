# Prescripto

**A complete clinic appointment workflow, ready to explore without an account.**

[**Open the live demo →**](https://prescripto-doctorbooking.vercel.app) · [Try the staff desk](https://prescripto-doctorbooking.vercel.app/demo-desk) · [Connected staff app](https://prescripto-doctorbooking-admin.vercel.app)

<p align="center"><img src="frontend/src/assets/assets_frontend/header_img.png" width="460" alt="Prescripto doctor illustration" /></p>

## What you can try

| Workflow | Working features |
| --- | --- |
| Find a doctor | Name search, specialty filters, profiles and available half-hour slots |
| Book a visit | Slot selection, duplicate-booking checks and saved appointment history |
| Manage bookings | Simulated payment, cancellation, booking export and reload persistence |
| Visitor profile | Edit sample contact details and profile image |
| Demo staff desk | Filter by doctor, complete/cancel bookings, pause/resume doctor availability |
| Connected staff app | Protected administrator and doctor dashboards backed by MongoDB |

### A two-minute walkthrough

1. Open **All Doctors** and search for **Richard**.
2. Choose an available time and book the sample consultation.
3. In **My appointments**, select **Simulate payment** and reload the page.
4. Open **Demo staff desk** to mark it complete, or book another appointment and cancel it.
5. Use **Reset and start a fresh demo** in the footer to clear this browser's sample data.

The public visitor demo uses fictional sample data stored locally. It does not create a real consultation, contact a doctor, or charge a payment card. The demo staff desk shares the visitor's local data; the separate connected staff application uses its own authenticated backend.

## Technology

React 19 · Vite · Tailwind CSS · Express · MongoDB/Mongoose · JWT · Cloudinary · Stripe Checkout

## Run the demo locally

Requires Node.js 22+.

```bash
git clone https://github.com/hasan1470/prescripto.git
cd prescripto/frontend
npm ci
npm run dev
```

Demo mode is enabled by default. No database, account, Stripe key or `.env` file is needed for the visitor and demo staff flows.

## Connect a client's services

1. Copy the `.env.example` files in `backend`, `frontend` and `admin` to `.env` in their respective folders.
2. Configure MongoDB, a fresh `JWT_SECRET`, administrator credentials and Cloudinary in `backend/.env`.
3. Set `VITE_DEMO_MODE=false` and `VITE_BACKEND_URL` in the visitor frontend; set the same backend URL in the staff app.
4. For online payments, add `STRIPE_SECRET_KEY` and set `FRONTEND_URL` to the visitor site's exact origin.
5. Install dependencies in each folder with `npm ci`. Run the backend with `npm start`, and either frontend with `npm run dev`.

All backend secrets stay on the server. Connected checkout gets its fee and appointment owner from the database, then confirms Stripe's paid status before recording payment. The portfolio version reconciles payment when the visitor returns from Checkout; webhook synchronization and refund operations should be added for unattended real-clinic payment management. Start client payment verification with [Stripe test credentials](https://docs.stripe.com/testing).

Existing accounts created before the token update must sign in again. Use fresh credentials and client-owned services for a new installation.

## Deploy on Vercel

| Vercel project | Root | Build/output | Configuration |
| --- | --- | --- | --- |
| Visitor demo | `frontend` | Vite / `dist` | No secrets needed; demo mode defaults to true |
| Connected staff | `admin` | Vite / `dist` | `VITE_BACKEND_URL` |
| API | `backend` | Existing `vercel.json` | MongoDB, JWT, admin and optional payment/upload keys |

For connected visitor deployments set `VITE_DEMO_MODE=false`. Rebuild after changing any `VITE_` setting. No paid Vercel add-ons are required by the demo.

## Verification

```bash
npm test --prefix frontend
npm test --prefix backend
npm run build --prefix frontend
npm run build --prefix admin
```

Regression coverage includes role separation, token expiry, credential-free JWT claims, duplicate demo bookings, slot selection, and closed-booking transitions. The public doctor endpoint excludes password hashes and private contact fields. Connected booking reserves a slot atomically, and cancellation releases it only once.

## Project background

Extended by [Abdullah Hasan](https://github.com/hasan1470). The original Prescripto tutorial starter and bundled visual assets credit GreatStack. Portfolio additions include the visitor/staff demo, booking and payment flows, accessibility fixes, secure authentication, server validation and deployment documentation.
