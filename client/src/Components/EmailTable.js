import EmailRow from './EmailRow';
import "../styles/index.css"



function EmailTable({ emails, filterText, selectedEmails, setSelectedEmails, handleDeleteEmail, handleMarkAsRead }) {
  const filteredEmails = emails.filter(email => email.from.toLowerCase().includes(filterText.toLowerCase()));

  const allSelected = filteredEmails.length > 0 && filteredEmails.every(email =>
    selectedEmails.includes(email.messageId)
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      // Deselect all filtered emails
      const remaining = selectedEmails.filter(id => !filteredEmails.some(email => email.messageId === id));
      setSelectedEmails(remaining);
    } else {
      // Add all filtered emails to selectedEmails (avoid duplicates)
      const newSelected = [
        ...new Set([...selectedEmails, ...filteredEmails.map(email => email.messageId)])
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
          {filteredEmails.map(email => (
            <EmailRow
              key={email.messageId}
              email={email}
              selectedEmails={selectedEmails}
              setSelectedEmails={setSelectedEmails}
              handleDeleteEmail={handleDeleteEmail}
              handleMarkAsRead={handleMarkAsRead}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmailTable;
