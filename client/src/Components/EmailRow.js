import "../styles/index.css"

function EmailRow({ email, selectedEmails, setSelectedEmails, handleDeleteEmail, handleMarkAsRead }) {
  const toggleSelection = () => {
    setSelectedEmails(prev =>
      prev.includes(email.messageId)
        ? prev.filter(id => id !== email.messageId)
        : [...prev, email.messageId]
    );
  };

  return (
    <tr style={{ backgroundColor: email.isRead ? '#f9f9f9' : '#fff' }}>
      <td><input type="checkbox" checked={selectedEmails.includes(email.messageId)} onChange={toggleSelection} /></td>
      <td>{email.from}</td>
      <td>{email.subject}</td>
      <td>{email.date}</td>
      <td>
        <button class = "delete" onClick={async () => {
          await handleDeleteEmail(email.messageId);
          setSelectedEmails(prev => prev.filter(id => id !== email.messageId));
        }}>Delete</button>
        {!email.isRead && (
          <button class = "markAsRead" onClick={async () => {
            await handleMarkAsRead(email.messageId);
          }}>Mark as Read</button>
        )}
      </td>
    </tr>
  );
}

export default EmailRow;
