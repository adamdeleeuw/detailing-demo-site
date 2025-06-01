# Demo Site: CrystalClear Car Care

**Live Demo:** 

## About This Project

CrystalClear Car Care is a sleek multi-section website designed for an automotive detailing business. It demonstrates a responsive layout, service breakdown, photo gallery, and a fully functional booking form (with a local Node.js/Nodemailer backend).

This project showcases a professional "Starter Website Package" for businesses that want a clean, modern web presence to attract local clients and collect appointment requests.

## Key Features

- **Responsive Design**: Mobile-first layout with flexible components for desktop, tablet, and phone.
- **Hero Section**: Immediate branding and service CTA.
- **Service Section**: Clear overview of available detailing packages.
- **Image Gallery**:
  - Visual showcase of previous detailing work.
  - Built-in lightbox effect for expanded viewing.
- **Contact & Booking Form**:
  - Client-side form validation for better UX.
  - Backend (Node.js + Express) handles real email submissions (local only).
- **Mobile Navigation**: Hamburger menu with toggleable overlay.
- **Clean, Functional UI**: Optimized for readability and conversion.

## Tech Stack

**Frontend**:
- HTML5
- CSS3 (Flexbox, media queries, CSS variables)
- JavaScript (Vanilla ES6+)

**Backend** (for local demo):
- Node.js
- Express.js
- Nodemailer (for booking form email delivery)

**Development Tools**:
- `dotenv` for managing environment variables
- `nodemon` for local development server reloading

## Running This Project Locally (for Developers)

To test form submission and email sending functionality:

### Prerequisites

- Node.js and npm
- Git

### Clone the Repository

```bash
git clone https://github.com/adamdeleeuw/demo-car-detailing.git
cd demo-car-detailing
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your email credentials:

```env
EMAIL_USER="your_gmail_address@gmail.com"
EMAIL_PASS="your_gmail_app_password"
CLIENT_NOTIFICATION_EMAIL="email_to_receive_bookings@example.com"
```

> ⚠️ Gmail App Passwords are recommended for security. Make sure 2FA is enabled on your Google account.

### Run the Server

```bash
npm run dev
```

The local development site should be available at `http://localhost:3000`.

## Notes on GitHub Pages Demo

- The live site hosted on GitHub Pages is **static only**.
- Form submissions **will not work** in the demo, since GitHub Pages does not support server-side code.
- For live submissions, consider:
  - Integrating a static form service (e.g., [Formspree](https://formspree.io), [Getform](https://getform.io))
  - Hosting the backend on [Render](https://render.com) or [Railway](https://railway.app)

## Author

Adam de Leeuw

## License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.
