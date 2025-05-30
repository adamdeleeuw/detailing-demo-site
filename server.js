// filepath: /home/adamjdl/Documents/DemoSite_1/server.js
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer'); // Import nodemailer
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello from the CrystalClean Car Care server!');
});

// Route to handle booking form submission
app.post('/send-booking', async (req, res) => {
    const {
        name,
        email,
        phone,
        serviceType,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleCondition,
        notes
    } = req.body;

    // Basic validation (you can add more robust validation here)
    if (!name || !email || !phone || !serviceType || !vehicleMake || !vehicleModel || !vehicleYear) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // --- Nodemailer Transport Configuration ---
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"), // Ensure port is a number
        secure: (process.env.EMAIL_PORT === '465'), // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Optional: If using self-signed certificates or specific TLS versions for local/test SMTP servers
        // tls: {
        //   rejectUnauthorized: false // Not recommended for production with real SMTP servers
        // }
    });

    // --- Email to Business Owner ---
    const mailToBusinessOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Use sender's name, but send from your configured email
        to: process.env.BUSINESS_EMAIL,
        replyTo: email, // So you can directly reply to the customer from your inbox
        subject: `New Booking Request: ${serviceType} for ${name}`,
        html: `
            <h1>New Booking Request</h1>
            <p><strong>Name:</strong> ${name}</p>
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
            <h1>Thank You, ${name}!</h1>
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
        // Send email to business
        await transporter.sendMail(mailToBusinessOptions);
        console.log('Email sent to business:', process.env.BUSINESS_EMAIL);

        // Send confirmation email to user
        await transporter.sendMail(mailToUserOptions);
        console.log('Confirmation email sent to user:', email);

        res.status(200).json({ message: 'Booking request sent successfully! You will receive a confirmation email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        // Log the detailed error for server-side debugging
        // For the client, send a more generic error
        let clientErrorMessage = "Failed to send booking request. Please try again later.";
        if (error.responseCode === 535) { // Example: Authentication error
            clientErrorMessage = "Server authentication error with email provider. Please contact support.";
        } else if (error.code === 'ECONNREFUSED') {
            clientErrorMessage = "Could not connect to email server. Please contact support.";
        }
        // It's good practice not to expose too much detail about server errors to the client.
        res.status(500).json({ message: clientErrorMessage, errorDetails: error.message }); // error.message for dev context
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});