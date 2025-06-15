const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser'); // 🚨 Add this line
const app = express();
app.use(bodyParser.json()); // ✅ Parse JSON body data
app.use(cors());


require('dotenv').config();


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Auth URL
app.get('/auth/url', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
    ],
  });
  res.send({ url });
});

// Callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // FIX: Pass token correctly to frontend
  res.redirect(`http://localhost:3000/auth/callback?token=${tokens.access_token}`);
});

app.post('/gmail/emails', async (req, res) => {
  const { token } = req.body;

  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: token });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 50,
    });

    const messageIds = response.data.messages || [];

    // Fetch detailed information for each message
    const messages = await Promise.all(
      messageIds.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
        });

        const headers = detail.data.payload.headers;
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');
        const dateHeader = headers.find(h => h.name === 'Date');

        const body = detail.data.payload.parts
          ? detail.data.payload.parts
              .filter(part => part.mimeType === 'text/plain')
              .map(part => part.body.data)
              .join('')
          : '(No body)';

        return {
          messageId: msg.id,  // Store messageId
          subject: subjectHeader ? subjectHeader.value : '(No Subject)',
          from: fromHeader ? fromHeader.value : '(Unknown Sender)',
          date: dateHeader ? dateHeader.value : '(No Date)',
          body: Buffer.from(body, 'base64').toString('utf-8'), // Decode body from base64
          isRead: detail.data.labelIds && detail.data.labelIds.includes('INBOX') && !detail.data.labelIds.includes('UNREAD'),  // Mark as read based on labels
        };
      })
    );

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching Gmail messages:', error);
    res.status(500).send('Failed to fetch emails');
  }
});


//Delete
app.post('/gmail/delete', async (req, res) => {
  const { token, messageId } = req.body;
  
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: token });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  
  try {
    await gmail.users.messages.trash({
      userId: 'me',
      id: messageId,
    });
    res.send({ message: 'Email deleted successfully' });
  } catch (err) {
    console.error('Failed to delete email:', err);
    res.status(500).send('Failed to delete email');
  }
});


//Mark as Read

app.post('/gmail/markAsRead', async (req, res) => {
  const { token, messageId } = req.body;

  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: token });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      resource: {
        removeLabelIds: ['UNREAD'],
      },
    });
    res.send({ message: 'Email marked as read' });
  } catch (err) {
    console.error('Failed to mark as read:', err);
    res.status(500).send('Failed to mark as read');
  }
});


//Fetch with name

app.post('/gmail/searchByName', async (req, res) => {
  const { token, sender } = req.body;

  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: token });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: `from:${sender}`,
      maxResults: 10,
    });

    const messageIds = response.data.messages || [];

    const messages = await Promise.all(
      messageIds.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
        });

        const headers = detail.data.payload.headers;
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');
        const dateHeader = headers.find(h => h.name === 'Date');

        const body = detail.data.payload.parts
          ? detail.data.payload.parts
              .filter(part => part.mimeType === 'text/plain')
              .map(part => part.body.data)
              .join('')
          : '(No body)';

        return {
          messageId: msg.id,
          subject: subjectHeader?.value || '(No Subject)',
          from: fromHeader?.value || '(Unknown Sender)',
          date: dateHeader?.value || '(No Date)',
          body: Buffer.from(body, 'base64').toString('utf-8'),
          isRead: detail.data.labelIds && detail.data.labelIds.includes('INBOX') && !detail.data.labelIds.includes('UNREAD'),
        };
      })
    );

    res.json({ messages });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).send('Search failed');
  }
});




app.listen(5000, () => console.log('Server running on http://localhost:5000'));
