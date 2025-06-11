import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "../styles/index.css";

function Dashboard() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const [emails, setEmails] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);



  useEffect(() => {
    const fetchEmails = async () => {
      if (token) {
        try {
          const res = await axios.post('http://localhost:5000/gmail/emails',
            { token },
            { headers: { 'Content-Type': 'application/json' } }
          );
          setEmails(res.data.messages);
          console.log(res.data.messages);
        } catch (err) {
          console.error('Failed to fetch emails:', err);
        }
      }
    };

    fetchEmails();
  }, [token]);

  const handleDeleteEmail = async (messageId) => {
    try {
      console.log(messageId);
      const res = await axios.post('http://localhost:5000/gmail/delete',
        { token, messageId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(res.data.message);
      setEmails(emails.filter(email => email.messageId !== messageId)); // Remove the email from the list
    } catch (err) {
      console.error('Failed to delete email:', err);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const res = await axios.post('http://localhost:5000/gmail/markAsRead',
        { token, messageId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(res.data.message);
      setEmails(emails.map(email =>
        email.messageId === messageId ? { ...email, isRead: true } : email
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filter by sender"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '14px',
            width: '250px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
       
        <button
          onClick={async () => {
            for (const id of selectedEmails) {
              await handleDeleteEmail(id);
            }
            setSelectedEmails([]); // Clear selection after deletion
          }}
          disabled={selectedEmails.length === 0}
          style={{ marginRight: '10px' }}
        >
          Delete Selected
        </button>

        <button
          onClick={async () => {
            for (const id of selectedEmails) {
              await handleMarkAsRead(id);
            }
            setSelectedEmails([]); // Clear selection after marking
          }}
          disabled={selectedEmails.length === 0}
        >
          Mark Selected as Read
        </button>
      </div>


      <h2>Recent Emails:</h2>
      <table className="email-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>From</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emails
            .filter((email) =>
              email.from.toLowerCase().includes(filterText.toLowerCase())
            )
            .map((email, idx) => (
              <tr key={email.messageId} style={{ backgroundColor: email.isRead ? '#f9f9f9' : '#fff' }}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email.messageId)}
                    onChange={() => {
                      setSelectedEmails((prev) =>
                        prev.includes(email.messageId)
                          ? prev.filter((id) => id !== email.messageId)
                          : [...prev, email.messageId]
                      );
                    }}
                  />
                </td>
                <td>{email.from}</td>
                <td>{email.subject}</td>
                <td>{email.date}</td>
                <td>
                  <button onClick={() => handleDeleteEmail(email.messageId)} className="delete">Delete</button>
                  {!email.isRead && (
                    <button onClick={() => handleMarkAsRead(email.messageId)} className="markAsRead">Mark as Read</button>
                  )}
                </td>
              </tr>

            ))}
        </tbody>
      </table>
    </div>

  );
}

export default Dashboard;

