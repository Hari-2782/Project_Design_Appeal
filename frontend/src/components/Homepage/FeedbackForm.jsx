import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Container, Typography, CircularProgress, Box, Grow
} from '@mui/material';

const FeedbackForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading indicator
        try {
            const response = await fetch('/api/feedback/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
            if (response.ok) {
                setFeedbackSubmitted(true);
                setName('');
                setEmail('');
                setMessage('');

                // Redirect to home page after 10 seconds
                setTimeout(() => {
                    navigate('/');
                }, 10000);
            } else {
                alert('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback');
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Grow in={true}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Feedback Form
                    </Typography>
                    {feedbackSubmitted ? (
                        <Typography variant="h6" color="success.main">
                            Thank you for your feedback! You will be redirected to the home page in 10 seconds.
                        </Typography>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                label="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <Box sx={{ position: 'relative', mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                                >
                                    Submit
                                </Button>
                                {loading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'primary.main',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Box>
                        </form>
                    )}
                </Box>
            </Grow>
        </Container>
    );
};

export default FeedbackForm;
