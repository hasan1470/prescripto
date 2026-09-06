# Prescripto admin dashboard

[Open the admin demo](https://prescripto-doctorbooking-admin.vercel.app) · [Patient website](https://prescripto-doctorbooking.vercel.app)

Sign in with **admin / admin** to explore sample doctors, appointments, availability and doctor creation. Switch to doctor login and use **doctor / doctor** for the sample doctor dashboard and profile.

Records are fictional and saved in this browser. The admin site and patient site have separate demo storage because they use different origins; use the patient site’s demo staff desk to manage bookings made there. Reset sample data from the dashboard banner.

Run `npm ci` then `npm run dev`. No backend or secrets are required in default demo mode. For a client installation, set `VITE_DEMO_MODE=false` and `VITE_BACKEND_URL` in `.env`, rebuild, and use server-configured administrator or registered doctor credentials. Public demo passwords are never accepted by the real API.

See the [main project README](../README.md) for full setup, deployment and payment integration details.
