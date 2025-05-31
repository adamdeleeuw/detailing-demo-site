require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path'); // Import the 'path' module
const app = express();
const port = process.env.PORT || 3000;

// --- Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Serve Static Frontend Files ---
// Serve files from the project's root directory (for index.html, style.css, app.js, images, etc.)
app.use(express.static(path.join(__dirname)));
// Serve files from the 'pg_book' directory specifically if needed,
// but the above line should make files in subdirectories accessible too via their path.
// For example, http://localhost:3000/pg_book/book.html will work.

// --- API Routes ---
app.get('/api/test', (req, res) => { // Changed test route to avoid conflict if you have a root index.html
    res.send('Hello from the CrystalClean Car Care server API!');
});

app.post('/send-booking', async (req, res) => {
    const {
        // ... (destructuring req.body) ...
        fullName, // Make sure you are using fullName from the form
        email,
        phone,
        serviceType,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleCondition,
        notes
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !serviceType || !vehicleMake || !vehicleModel || !vehicleYear) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const customerName = fullName; // Use fullName directly

    // --- Nodemailer Transport Configuration ---
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: (process.env.EMAIL_PORT === '465'),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    // --- Email to Business Owner ---
    const mailToBusinessOptions = {
        from: `"${customerName}" <${process.env.EMAIL_USER}>`,
        to: process.env.BUSINESS_EMAIL,
        replyTo: email,
        subject: `New Booking Request: ${serviceType} for ${customerName}`,
        html: `
            <h1>New Booking Request</h1>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <hr>
            <p><strong>Service Type:</strong> ${serviceType}</p>
            <p><strong>Vehicle Make:</strong> ${vehicleMake}</p>
            <p><strong>Vehicle Model:</strong> ${vehicleModel}</p>
            <p><strong>Vehicle Year:</strong> ${vehicleYear}</p>
            <p><strong>Vehicle Condition:</strong> ${vehicleCondition || 'Not specified'}</p>
            <p><strong>Notes:</strong></p>
            <p>${notes || 'None'}</p>
        `
    };

    // --- Optional: Confirmation Email to User ---
    const mailToUserOptions = {
        from: `"CrystalClean Car Care" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Booking Request Received - CrystalClean Car Care',
        html: `
            <h1>Thank You, ${customerName}!</h1>
            <p>We have received your booking request for <strong>${serviceType}</strong>.</p>
            <p>Here's a summary of your request:</p>
            <ul>
                <li><strong>Vehicle:</strong> ${vehicleMake} ${vehicleModel} (${vehicleYear})</li>
                <li><strong>Notes:</strong> ${notes || 'None'}</li>
            </ul>
            <p>We will contact you shortly to confirm the details and appointment time.</p>
            <p>Sincerely,<br>The CrystalClean Car Care Team</p>
        `
    };

    try {
        await transporter.sendMail(mailToBusinessOptions);
        console.log('Email sent to business:', process.env.BUSINESS_EMAIL);

        await transporter.sendMail(mailToUserOptions);
        console.log('Confirmation email sent to user:', email);

        res.status(200).json({ message: 'Booking request sent successfully! You will receive a confirmation email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        let clientErrorMessage = "Failed to send booking request. Please try again later.";
        if (error.responseCode === 535) {
            clientErrorMessage = "Server authentication error with email provider. Please contact support.";
        } else if (error.code === 'ECONNREFUSED') {
            clientErrorMessage = "Could not connect to email server. Please contact support.";
        }
        res.status(500).json({ message: clientErrorMessage, errorDetailsForDev: error.message });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Access your site: http://localhost:${port}/index.html`);
    console.log(`Access booking page: http://localhost:${port}/pg_book/book.html`);
});