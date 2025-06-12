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

  useEffect(() => {
    const fetchEmails = async () => {
      if (token) {
        try {
          const res = await axios.post('http://localhost:5000/gmail/emails', { token });
          setEmails(res.data.messages);
        } catch (err) {
          console.error('Failed to fetch emails:', err);
        }
      }
    };
    fetchEmails();
  }, [token]);

  const handleDeleteEmail = async (messageId) => {
    await axios.post('http://localhost:5000/gmail/delete', { token, messageId });
  };

  const handleMarkAsRead = async (messageId) => {
    await axios.post('http://localhost:5000/gmail/markAsRead', { token, messageId });
  };

  return (
    <div className="container">
      <FilterBar filterText={filterText} setFilterText={setFilterText} />
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
        filterText={filterText}
        selectedEmails={selectedEmails}
        setSelectedEmails={setSelectedEmails}
        handleDeleteEmail={handleDeleteEmail}
        handleMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}

export default Dashboard;
