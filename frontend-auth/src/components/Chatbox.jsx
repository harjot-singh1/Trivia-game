import React, { useState } from 'react';
import NavBar from './NavBar';
import './Chatbox.css';
import axios from 'axios';

const Chatbox = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSend = async () => {
        if (message.trim() !== '') {
            setMessages((prevMessages) => [...prevMessages, message]);

            try {
                const response = await axios.post('https://qiuc1xjkaj.execute-api.us-east-1.amazonaws.com/dev/lex', {
                    message: message,
                });

                if (response?.data?.messages[0]?.content) {
                    setMessages((prevMessages) => [...prevMessages, response?.data?.messages[0]?.content]);
                    setMessage('');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                // Optionally handle the error here
            }
        }
    }

    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-9 offset-2 p-4" style={{ height: "90vh" }}>
                        <div className="d-flex h-100">
                            <div className="msg-container h-75">
                                {messages.map((msg, index) => (
                                    <div className='px-3 py-1 my-2 msg' key={index}>{msg}</div>
                                ))}
                            </div>
                            <textarea
                                className='align-self-end w-75 h-25'
                                style={{ maxHeight: "10vh" }}
                                value={message}
                                onChange={handleMessageChange}
                            ></textarea>
                            <button
                                className={`btn join-btn d-flex justify-content-end align-self-end btn-dark mx-3`}
                                onClick={handleSend}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbox;
