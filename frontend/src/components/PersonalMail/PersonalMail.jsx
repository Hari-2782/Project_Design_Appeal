import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import './PersonalMail.css';

// Mail Item Component
const MailItem = ({ email }) => {
  return (
    <div className="mail-item">
      <h3>{email.subject}</h3>
      <p>{email.body}</p>
      <span>From: {email.from}</span>
    </div>
  );
};

// Mail List Component
const MailList = ({ type }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching emails

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(`/api/emails/${type}`);
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false); // Stop loading after fetching is done
      }
    };

    fetchEmails();
  }, [type]);

  return (
    <div className="mail-list">
      {loading ? (
        <div className="loading-screen">
          <CircularProgress />
          <p>Loading emails...</p>
        </div>
      ) : emails.length === 0 ? (
        <p>No emails available</p>
      ) : (
        emails.map((email, index) => <MailItem key={index} email={email} />)
      )}
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
  const [loading, setLoading] = useState(false); // Loading state for sending email
  const [emailSent, setEmailSent] = useState(false); // State to show success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when form is submitted

    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailSent(true); // Show success message
      setFormData({ to: '', subject: '', body: '' }); // Clear form
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setLoading(false); // Stop loading after attempt
    }
  };

  return (
    <div className="compose-mail">
      <h2>Compose Mail</h2>
      {loading ? (
        <div className="loading-screen">
          <CircularProgress /> {/* Loading spinner while sending email */}
          <p>Sending email...</p>
        </div>
      ) : emailSent ? (
        <p>Email sent successfully!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            To:
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Subject:
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Body:
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

// Main Mail Page Component
const PersonalMail = () => {
  const [currentView, setCurrentView] = useState('received');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="mail-page">
      <header>
        <h1>Personal Mail</h1>
        <nav>
          <button onClick={() => handleViewChange('received')}>Inbox</button>
          <button onClick={() => handleViewChange('sent')}>Sent</button>
          <button onClick={() => handleViewChange('compose')}>Compose</button>
        </nav>
      </header>
      <main>
        {currentView === 'received' && <MailList type="received" />}
        {currentView === 'sent' && <MailList type="sent" />}
        {currentView === 'compose' && <ComposeMail />}
      </main>
    </div>
  );
};

export default PersonalMail;
