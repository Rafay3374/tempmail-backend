const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(cors());

// Test route (ye check karne ke liye hai ki server chal raha hai ya nahi)
app.get('/', (req, res) => {
    res.send('Temp Mail Backend is running successfully!');
});

// Postmark Inbound Webhook Endpoint
app.post('/api/inbound-email', (req, res) => {
    const emailData = req.body;

    // Postmark se aane wala data extract kar rahe hain
    const sender = emailData.From;       // Jisne email bheji
    const recipient = emailData.To;     // Jis temp address par aayi (e.g., xyz@adscameo.com)
    const subject = emailData.Subject;   // Email ka subject
    const textBody = emailData.TextBody; // Email ka text message

    console.log("----------------------------------------");
    console.log(`New Email Received!`);
    console.log(`To: ${recipient}`);
    console.log(`From: ${sender}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${textBody}`);
    console.log("----------------------------------------");

    // Yahan aap is email ko database (jaise MongoDB/Redis) mein save karenge
    // Aur WebSocket (Socket.io) ke zariye frontend par bhej denge.

    res.status(200).send({ status: 'Success', message: 'Email processed successfully' });
});

// Server start karna
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});