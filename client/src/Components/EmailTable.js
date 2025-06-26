import EmailRow from './EmailRow';
import "../styles/index.css";

function EmailTable({
  emails,
  setEmails,
  selectedEmails,
  setSelectedEmails,
  handleDeleteEmail,
  handleMarkAsRead,
  filterText,
  showSpamOnly
}) {
  // Filter emails based on sender and spam status
  const filteredEmails = emails.filter(email => {
    const matchSender = email.from.toLowerCase().includes(filterText.toLowerCase());
    const matchSpam = !showSpamOnly || email.isSpam === true;
    return matchSender && matchSpam;
  });

  const allSelected = filteredEmails.length > 0 &&
    filteredEmails.every(email => selectedEmails.includes(email.messageId));

  const toggleSelectAll = () => {
    if (allSelected) {
      const remaining = selectedEmails.filter(
        id => !filteredEmails.some(email => email.messageId === id)
      );
      setSelectedEmails(remaining);
    } else {
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
            <th>Spam</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmails.map(email => (
            <EmailRow
              key={email.messageId}
              emails={emails}
              email={email}
              selectedEmails={selectedEmails}
              setSelectedEmails={setSelectedEmails}
              handleDeleteEmail={handleDeleteEmail}
              handleMarkAsRead={handleMarkAsRead}
              setEmails={setEmails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmailTable;
