import React, { useState } from 'react';
import './PersonalMail.css';

// Mail Item Component
const MailItem = ({ email }) => {
  return (
    <div className="mail-item">
      <h3>{email.subject}</h3>
      <p>{email.body}</p>
      <span>From: {email.sender}</span>
    </div>
  );
};

// Mail List Component
const MailList = ({ type }) => {
  // Example data, you would fetch this from an API or database
  const emails = [
    { id: 1, subject: 'Hello World', body: 'This is the body of the email.', sender: 'example@example.com' },
    { id: 2, subject: 'React is Awesome', body: 'This is another email.', sender: 'react@example.com' },
  ];

  return (
    <div className="mail-list">
      <h2>{type === 'inbox' ? 'Inbox' : 'Sent'}</h2>
      {emails.map((email) => (
        <MailItem key={email.id} email={email} />
      ))}
    </div>
  );
};

// Compose Mail Component
const ComposeMail = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle sending the email, e.g., through an API call
    console.log('Sending email:', formData);
  };

  return (
    <div className="compose-mail">
      <h2>Compose Mail</h2>
      <form onSubmit={handleSubmit}>
        <label>
          To:
          <input type="email" name="to" value={formData.to} onChange={handleChange} required />
        </label>
        <label>
          Subject:
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
        </label>
        <label>
          Body:
          <textarea name="body" value={formData.body} onChange={handleChange} required></textarea>
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

// Main Mail Page Component
const PersonalMail = () => {
  const [currentView, setCurrentView] = useState('inbox');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="mail-page">
      <header>
        <h1>Personal Mail</h1>
        <nav>
          <button onClick={() => handleViewChange('inbox')}>Inbox</button>
          <button onClick={() => handleViewChange('sent')}>Sent</button>
          <button onClick={() => handleViewChange('compose')}>Compose</button>
        </nav>
      </header>
      <main>
        {currentView === 'inbox' && <MailList type="inbox" />}
        {currentView === 'sent' && <MailList type="sent" />}
        {currentView === 'compose' && <ComposeMail />}
      </main>
    </div>
  );
};

export default PersonalMail;
