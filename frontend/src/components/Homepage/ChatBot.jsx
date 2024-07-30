// src/components/ChatBot.js
import React from 'react';
import { Box, Paper } from '@mui/material';

const ChatBot = () => {
    return (
        <Paper style={{ position: 'fixed', bottom: 20, right: 20, width: 350, height: 500 }}>
            <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
                <iframe
                    width="100%"
                    height="100%"
                    allow="microphone;"
                    src="https://console.dialogflow.com/api-client/demo/embedded/e90d493b-1885-4c08-9b2b-1b15be80067e"
                    title="ChatBot"
                    style={{ border: 'none' }}
                ></iframe>
            </Box>
        </Paper>
    );
};

export default ChatBot;
