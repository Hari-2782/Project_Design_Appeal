// controllers/emailController.js
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'balacinema235@gmail.com',
        pass: 'cfyf tsva vqfe nfpk', // Use environment variables for better security
    },
    tls: {
        rejectUnauthorized: false, // This allows self-signed certificates
    },
});

async function fetchReceivedEmails() {
    const config = {
        imap: {
            user: 'balacinema235@gmail.com',
            password: 'cfyf tsva vqfe nfpk',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
            authTimeout: 10000, // Increase timeout to 10 seconds
            connectTimeout: 10000 // Increase connect timeout to 10 seconds
        }
    };
    

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER'],
            markSeen: false,
        };
        // Sort by date in descending order
        const messages = await connection.search(searchCriteria, fetchOptions);
        const sortedMessages = messages.sort((a, b) => new Date(b.parts[0].body.date[0]) - new Date(a.parts[0].body.date[0]));
        const limitedMessages = sortedMessages.slice(0, 200);

        return limitedMessages.map(message => {
            const header = message.parts.find(part => part.which === 'HEADER').body;
            return { subject: header.subject[0], from: header.from[0], date: header.date[0] };
        });
    } catch (error) {
        console.error('Error fetching received emails:', error);
        throw error;
    }
}

async function fetchSentEmails() {
    const config = {
        imap: {
            user: 'balacinema235@gmail.com',
            password: 'cfyf tsva vqfe nfpk',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
            authTimeout: 10000,
            connectTimeout: 10000
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('[Gmail]/Sent Mail');
        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER'],
            markSeen: false,
        };

        // Fetch emails and sort by date
        const messages = await connection.search(searchCriteria, fetchOptions);
        const sortedMessages = messages.sort((a, b) => {
            const dateA = new Date(a.parts[0].body.date[0]);
            const dateB = new Date(b.parts[0].body.date[0]);
            return dateB - dateA;
        });
        const limitedMessages = sortedMessages.slice(0, 200);

        return limitedMessages.map(message => {
            const header = message.parts.find(part => part.which === 'HEADER')?.body;

            if (header) {
                return {
                    subject: header.subject ? header.subject[0] : 'No Subject',
                    from: header.from ? header.from[0] : 'No Sender',
                    date: header.date ? header.date[0] : 'No Date'
                };
            } else {
                console.error('Header is undefined for a message:', message);
                return {
                    subject: 'No Subject',
                    from: 'No Sender',
                    date: 'No Date'
                };
            }
        });
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        throw error;
    }
}


const sendEmail = async (req, res) => {
    const { to, subject, body } = req.body;

    const mailOptions = {
        from: 'balacinema235@gmail.com',
        to,
        subject,
        text: body, // Use `html` if sending HTML content
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
};

module.exports = {
    fetchReceivedEmails,
    fetchSentEmails,
    sendEmail,
};
