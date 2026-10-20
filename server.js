const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Temporary storage for incoming emails (In-memory array for now)
let inboxEmails = [];

// 1. Webhook endpoint for Postmark Inbound Stream
app.post('/api/inbound-email', (req, res) => {
    try {
        const emailData = req.body;
        
        console.log("=== NEW EMAIL RECEIVED ===");
        console.log("From:", emailData.From);
        console.log("To:", emailData.To);
        console.log("Subject:", emailData.Subject);
        console.log("Text Body:", emailData.TextBody);

        // Save email to our temporary array
        inboxEmails.push({
            from: emailData.From,
            to: emailData.To,
            subject: emailData.Subject || "No Subject",
            body: emailData.TextBody || emailData.HtmlBody || "",
            date: new Date()
        });

        // Postmark requires a 200 OK response to confirm receipt
        return res.status(200).json({ success: true, message: "Email processed successfully" });
    } catch (error) {
        console.error("Error processing inbound email:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 2. API endpoint for Frontend to fetch received emails for a specific address
app.get('/api/emails/:emailAddress', (req, res) => {
    const targetEmail = req.params.emailAddress.toLowerCase();
    const userEmails = inboxEmails.filter(mail => mail.to.toLowerCase() === targetEmail);
    res.status(200).json(userEmails);
});

// Root test route
app.get('/', (req, res) => {
    res.send("Temp Mail Backend is running live!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});