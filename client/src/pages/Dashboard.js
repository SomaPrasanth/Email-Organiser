import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import FilterBar from '../Components/FilterBar';
import BulkActions from '../Components/BulkActions';
import EmailTable from '../Components/EmailTable';


function Dashboard() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');

  const [emails, setEmails] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showSpamOnly, setShowSpamOnly] = useState(false);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchEmails = async () => {
        if (!token) return;

        try {
          const endpoint = filterText.trim()
            ? 'http://localhost:5000/gmail/searchByName'
            : 'http://localhost:5000/gmail/emails';

          const res = await axios.post(endpoint,
            filterText.trim()
              ? { token, sender: filterText }
              : { token },
            { headers: { 'Content-Type': 'application/json' } }
          );

          // Run spam check
          const emailsWithSpam = await Promise.all(
            res.data.messages.map(async (email) => {
              const isSpam = await checkIfSpam(email.body);
              return { ...email, isSpam };
            })
          );

          setEmails(emailsWithSpam);
        } catch (err) {
          console.error('Failed to fetch emails:', err);
        }
      };

      fetchEmails();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filterText, token]);

  const checkIfSpam = async (body) => {
    try {
      const res = await axios.post('http://localhost:5000/check-spam', { message: body });
      return res.data.label === "spam";
    } catch (err) {
      console.error("Spam detection failed:", err);
      return false;
    }
  };


  const handleDeleteEmail = async (messageId) => {
    await axios.post('http://localhost:5000/gmail/delete', { token, messageId });
  };

  const handleMarkAsRead = async (messageId) => {
    await axios.post('http://localhost:5000/gmail/markAsRead', { token, messageId });
  };



  return (
    <div className="container">
      <FilterBar
    filterText={filterText}
    setFilterText={setFilterText}
    showSpamOnly={showSpamOnly}
    setShowSpamOnly={setShowSpamOnly}
    />

      <BulkActions
        emails={emails}
        setEmails={setEmails}
        selectedEmails={selectedEmails}
        setSelectedEmails={setSelectedEmails}
        handleDeleteEmail={handleDeleteEmail}
        handleMarkAsRead={handleMarkAsRead}
      />
      <EmailTable
  emails={emails}
  setEmails={setEmails}
  selectedEmails={selectedEmails}
  setSelectedEmails={setSelectedEmails}
  handleDeleteEmail={handleDeleteEmail}
  handleMarkAsRead={handleMarkAsRead}
  filterText={filterText}
  showSpamOnly={showSpamOnly}
/>

    </div>
  );
}

export default Dashboard;
