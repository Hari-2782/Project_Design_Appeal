import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

const PromotionalMailPage = () => {
  const [mails, setMails] = useState([]);
  const [currentMail, setCurrentMail] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editMailId, setEditMailId] = useState(null);
  const [showSendPrompt, setShowSendPrompt] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedMails = JSON.parse(localStorage.getItem('mails'));
    if (storedMails) {
      setMails(storedMails);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mails', JSON.stringify(mails));
  }, [mails]);

  const handleAddMail = () => {
    if (editMailId === null) {
      setMails([...mails, { id: mails.length + 1, content: currentMail }]);
    } else {
      setMails(mails.map(mail => mail.id === editMailId ? { ...mail, content: currentMail } : mail));
      setEditMailId(null);
    }
    setCurrentMail('');
    setShowEditor(false);
  };

  const handleSendMail = async () => {
    try {
      await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Promotional Email',
          body: currentMail,
        }),
      });
      alert(`Mail sent to ${email}!`);
      setShowSendPrompt(false);
      setEmail('');
    } catch (error) {
      console.error('Error sending mail:', error);
      alert('Failed to send email');
    }
  };

  const handleEditMail = (id, content) => {
    setEditMailId(id);
    setCurrentMail(content);
    setShowEditor(true);
  };

  const handleCancelEdit = () => {
    setEditMailId(null);
    setCurrentMail('');
    setShowEditor(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Promotional Mail</h2>
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
            height: '300px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            cursor: 'pointer',
          }}
          onClick={() => setShowEditor(true)}
        >
          <div style={{ fontSize: '48px', color: '#888' }}>+</div>
          <p style={{ marginTop: '10px', textAlign: 'center' }}>Create New Mail</p>
        </div>
        {mails.map((mail) => (
          <div
            key={mail.id}
            style={{
              width: '200px',
              height: '300px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div className="mail-content" dangerouslySetInnerHTML={{ __html: mail.content }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                onClick={() => {
                  setShowSendPrompt(true);
                  setCurrentMail(mail.content);
                }}
                style={{ padding: '5px 10px' }}
              >
                Send
              </button>
              <button
                onClick={() => handleEditMail(mail.id, mail.content)}
                style={{ padding: '5px 10px' }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {showEditor && (
        <div className="editor-modal">
          <div className="editor">
            <ReactQuill
              value={currentMail}
              onChange={setCurrentMail}
              placeholder="Type your mail content here..."
              modules={{
                toolbar: [
                  [{ 'font': [] }, { 'size': [] }],
                  [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline', 'strike' ],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'script': 'sub' }, { 'script': 'super' }],
                  ['blockquote', 'code-block'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                  [{ 'direction': 'rtl' }, { 'align': [] }],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
              }}
            />
            <button onClick={handleAddMail} style={{ marginTop: '10px', padding: '10px 20px' }}>
              Save
            </button>
            <button onClick={handleCancelEdit} style={{ marginTop: '10px', padding: '10px 20px', marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {showSendPrompt && (
        <div className="send-prompt-modal">
          <div className="send-prompt">
            <h3>Enter recipient email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button onClick={handleSendMail} style={{ padding: '10px 20px' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionalMailPage;
