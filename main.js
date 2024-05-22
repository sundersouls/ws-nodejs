const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { google } = require("googleapis");
const http = require("http");

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Set your desired port

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to send a message to a WhatsApp user
app.post('/send-message', async (req, res) => {
    try {
        const { userId, message } = req.body;

        // Check if the userId and message are provided
        if (!userId || !message) {
            return res.status(400).json({ error: 'userId and message are required' });
        }

        client.sendMessage(userId.substring(1)+"@c.us", message);

        // For now, let's just log the userId and message
        console.log('Sending message to user:', userId);
        console.log('Message:', message);

        // Send a success response
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Create Google Auth client
const auth = new google.auth.GoogleAuth({
    keyFile: "google_file.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

// Initialize Google Sheets client
async function initializeGoogleSheets() {
    const Googleclient = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: Googleclient });

    // Fetch spreadsheet metadata
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId: "1Rh_9WplKVCssDzPtM9BVfYMyNjqUS6Y-K-2Gv5ECwOo",
    });

    // Fetch rows from the spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: "1Rh_9WplKVCssDzPtM9BVfYMyNjqUS6Y-K-2Gv5ECwOo",
        range: "May!B4",
    });
    console.log(getRows.data);
    // Listen for WhatsApp events
    client.on('ready', () => {
        console.log('Client is ready!');
        console.log(client);
    });

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

	client.on('message_create',async message => {
        console.log(message);
        const contact = await message.getContact();
		if (message.body === '!ping') {
			const value = getRows.data.values[0][0]; // Extract the value
			message.reply(value); // Reply with the extracted value
            console.log("contact",contact);
		}
	});

    // Initialize WhatsApp client after setting up Google Sheets
    client.initialize();
}

// Call the function to start the process
initializeGoogleSheets();