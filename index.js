const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Or your email provider's SMTP server
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // App password or app-specific password
    }
});

// Email sending route
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: process.env.RECIPIENT_EMAIL, // Recipient address
        subject: `New Portfolio Contact: ${subject}`,
        html: `
            <h2>New Message from Portfolio Contact Form</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.toString() });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
