import React, { useState } from 'react';




const ContactUs = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault();
       
        const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
        const phoneNumber = "919496001108"; // your WhatsApp number (with country code, no '+')

        window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, "_blank");
    };
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Contact Us</h2>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 col-span-1 md:col-span-2"
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onChange={e=>setSubject(e.target.value)}
                    />
                    <textarea
                        rows="4"
                        placeholder="Your Message"
                        value={message}
                        className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 col-span-1 md:col-span-2"
                        onChange={e => setMessage(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 col-span-1 md:col-span-2"
                    >
                        Send A WhatsApp Message
                    </button>
                </form>

                <div className="text-gray-700 text-center mt-8 space-y-2">
                    <p>📍 Address: 123 Event Lane, Celebration City</p>
                    <p>📞 Phone: +91 98765 43210</p>
                    <p>📧 Email: contact@eventpioneers.com</p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
