# 📬 Email Organiser

Email Organiser is a full-stack Gmail-integrated application that helps users manage their inbox by:
- Viewing recent emails
- Deleting or marking emails as read
- Filtering emails by sender
- Detecting and filtering spam using AI

---

## 🚀 Features

- 🔐 **Google OAuth Login**  
  Authenticate securely using your Google account.

- 📥 **Email Fetching**  
  View your recent Gmail messages using the Gmail API.

- 🧹 **Inbox Management**  
  - Delete emails (moves to trash)
  - Mark emails as read
  - Select multiple emails for bulk actions
  - Select/Deselect all emails

- 🔍 **Filtering Options**  
  - Filter emails by sender
  - Separate checkbox to view only spam emails

- 🤖 **Spam Detection (AI-powered)**  
  Integrates a pretrained [BERT-based spam classifier](https://huggingface.co/SGHOSH1999/bert-email-spam-classifier_tuned) to detect and label spam emails.

---

## 🛠️ Tech Stack

### Frontend:
- React
- Axios
- React Router

### Backend:
- Node.js
- Express.js
- Google APIs (OAuth2, Gmail)
- Hugging Face Transformers (via API or backend inference)
- dotenv, body-parser, cors

---

## 🧩 Directory Structure


---

## 🧪 Setup & Installation

### Prerequisites
- Node.js & npm installed
- A [Google Cloud Project](https://console.cloud.google.com/) with Gmail API & OAuth consent screen configured

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/email-organiser.git
cd email-organiser
```
```bash
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=http://localhost:5000/auth/callback


# In the root or /server directory
cd server
npm install

# In the /client directory
cd ../client
npm install

# In /server
npm start

# In /client (in a new terminal)
npm start
```
Visit http://localhost:3000 to start using the app.

###🤖 Spam Detection
This project integrates a pretrained BERT spam classification model hosted on Hugging Face:
SGHOSH1999/bert-email-spam-classifier_tuned

The backend sends email content to the model and returns a spam/ham label to the frontend.

###📦 Future Enhancements
🗑️ Permanently delete emails

🚫 Block specific senders

📤 Compose and send emails

🧠 Train custom spam filters based on user feedback

###📝 License
This project is licensed under the MIT License.

###🙌 Acknowledgements
Google Gmail API

Hugging Face Transformers

React & Node.js Communities

