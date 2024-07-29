import React, { useState } from 'react';
import axios from 'axios';

const EmailNotification = () => {
    const [emailDetails, setEmailDetails] = useState({
        to: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setEmailDetails({
            ...emailDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/send-email', emailDetails);
        alert('Email sent successfully!');
    };

    return (
        <div>
            <h1>Send Email Notification</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    To:
                    <input type="email" name="to" value={emailDetails.to} onChange={handleChange} required />
                </label>
                <label>
                    Subject:
                    <input type="text" name="subject" value={emailDetails.subject} onChange={handleChange} required />
                </label>
                <label>
                    Message:
                    <textarea name="message" value={emailDetails.message} onChange={handleChange} required></textarea>
                </label>
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default EmailNotification;
