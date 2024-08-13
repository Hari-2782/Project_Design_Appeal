# Unique Creation

This is a full-stack web application featuring a frontend powered by Vite and a backend built with Express. The project integrates various technologies such as MongoDB for the database, Tailwind CSS for styling, and several other libraries to enhance functionality. Additionally, the application includes integration with the PayHere payment gateway for processing payments.

# Features
- User Authentication: Secure user authentication using bcryptjs for password hashing and jsonwebtoken for managing tokens.
- Image Upload and Processing: Images are uploaded to Cloudinary, with additional processing using sharp for optimization.
- Email Notifications: Automated email notifications are handled via nodemailer, supporting features like order confirmations and account verification.
- Charting and Visualization: Data visualization is made easy with recharts, providing dynamic and interactive charts.
- IMAP Integration: Email processing via imap-simple to handle incoming emails and perform automated tasks.
- Payment Integration: Secure and efficient payment processing using the PayHere gateway, allowing users to complete transactions seamlessly.
- State Management: Utilizes react-router-dom for routing and managing state in the frontend application.
# Tech Stack
 # Backend
 - Express: Fast, unopinionated, minimalist web framework for Node.js.
 - MongoDB & Mongoose: MongoDB as the database, with Mongoose for object data modeling (ODM).
 - Cloudinary: For image storage and management.
 - Nodemailer: For sending emails from the backend.
 - CryptoJS: For encryption and decryption of sensitive data.
 - Multer: Middleware for handling file uploads.
 - IMAP-Simple: Simple IMAP protocol handling for reading and processing emails.
 - Tailwind CSS: Utility-first CSS framework for rapid UI development.
 - PayHere: Payment gateway integration for processing online payments.
# Frontend
 - React: JavaScript library for building user interfaces.
 - Vite: Next-generation front-end tooling, providing fast build times and modern features.
 - Recharts: For creating dynamic and customizable charts.
 - React Router DOM: For handling routing in a React application.
# Running the Project
 # Development
 To run the project in development mode with both the backend and frontend:
```terminal
 npm run dev
```
# Contact
For any inquiries or issues, please reach out to Harisanth at hmsanth@gmail.com.

# License
This project is licensed under the MIT License. See the LICENSE file for details.

