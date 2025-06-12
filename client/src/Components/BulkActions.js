import "../styles/index.css"

function BulkActions({ emails, setEmails, selectedEmails, setSelectedEmails, handleDeleteEmail, handleMarkAsRead }) {
  const deleteSelected = async () => {
    const updated = emails.filter(email => !selectedEmails.includes(email.messageId));
    for (const id of selectedEmails) await handleDeleteEmail(id);
    setEmails(updated);
    setSelectedEmails([]);
  };

  const markAsReadSelected = async () => {
    for (const id of selectedEmails) await handleMarkAsRead(id);
    setEmails(emails.map(email => selectedEmails.includes(email.messageId) ? { ...email, isRead: true } : email));
    setSelectedEmails([]);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={deleteSelected} disabled={!selectedEmails.length} style={{ marginRight: '10px' }}>Delete Selected</button>
      <button onClick={markAsReadSelected} disabled={!selectedEmails.length}>Mark Selected as Read</button>
    </div>
  );
}

export default BulkActions;
