# Project Configuration Guide

This file contains important configuration steps and environment variables for setting up and running the ERP Employee Management System.

---

## 1. Environment Variables

Create a `.env` file in the `server/` directory with the following keys:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_SENDER=your_verified_sender_email
```

---

## 2. Super Admin Setup

- The default super admin is seeded via `server/scripts/seedSuperAdmin.js`.
- To change the super admin email or password, edit this script and re-run it as described in the README.

---

## 3. Running the Project

- Install dependencies in the root, `server/`, and `src/` folders.
- Start the backend from `server/` with `npm start`.
- Start the frontend from the root with `npm run dev`.

---

## 4. Email (SendGrid)

- Ensure your SendGrid account is active and the sender email is verified.
- Update the API key and sender in your `.env` file.

---

## 5. Additional Notes

- For production, set up HTTPS and secure your environment variables.
- See the README for architecture, diagrams, and more details.
