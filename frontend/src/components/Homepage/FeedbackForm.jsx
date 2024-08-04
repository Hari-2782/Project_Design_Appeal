import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Container, Typography, LinearProgress, Box, Grow
} from '@mui/material';

const FeedbackForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const navigate = useNavigate();

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
        <Box
            sx={{
                backgroundImage: 'url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm" sx={{ mt: 5, bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, p: 4, boxShadow: 3 }}>
                <Grow in={true}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Feedback Form
                        </Typography>
                        {feedbackSubmitted ? (
                            <Box>
                                <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
                                    Thank you for your feedback! You will be redirected to the home page in 10 seconds.
                                </Typography>
                                <LinearProgress color="success" />
                            </Box>
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
                                        <LinearProgress
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: 4,
                                            }}
                                        />
                                    )}
                                </Box>
                            </form>
                        )}
                    </Box>
                </Grow>
            </Container>
        </Box>
    );
};

export default FeedbackForm;
