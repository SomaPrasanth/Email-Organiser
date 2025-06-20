import EmailRow from './EmailRow';
import "../styles/index.css"



function EmailTable({ emails, setEmails,  selectedEmails, setSelectedEmails, handleDeleteEmail, handleMarkAsRead }) {
  
  const allSelected = emails.length > 0 && emails.every(email =>
    selectedEmails.includes(email.messageId)
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      // Deselect all filtered emails
      const remaining = selectedEmails.filter(id => !emails.some(email => email.messageId === id));
      setSelectedEmails(remaining);
    } else {
      // Add all filtered emails to selectedEmails (avoid duplicates)
      const newSelected = [
        ...new Set([...selectedEmails, ...emails.map(email => email.messageId)])
      ];
      setSelectedEmails(newSelected);
    }
  };

  return (
    <div>
      <h2>Recent Emails:</h2>
      <table className="email-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
            </th>
            <th>From</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emails.map(email => (
            <EmailRow
              key={email.messageId}
              emails={emails}
              email={email}
              selectedEmails={selectedEmails}
              setSelectedEmails={setSelectedEmails}
              handleDeleteEmail={handleDeleteEmail}
              handleMarkAsRead={handleMarkAsRead}
              setEmails= {setEmails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmailTable;
