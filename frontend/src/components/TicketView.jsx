import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TicketView = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const ticket = state?.ticket;

    const ticketRef = useRef();

    if (!ticket) return <p className="p-4">Ticket data not found.</p>;

    const downloadPDF = async () => {
        const canvas = await html2canvas(ticketRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ticket-${ticket._id}.pdf`);
    };

    const eventDate = new Date(ticket.event_id.event_date);
    const isExpired = new Date() > eventDate;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div ref={ticketRef} className="bg-white shadow-xl rounded-xl w-full max-w-md border border-gray-300 relative">
                <div className="bg-black text-white rounded-t-xl px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">{ticket.event_id.event_name}</h2>
                    <p className="text-sm">{new Date(ticket.event_id.event_date).toDateString()}</p>
                </div>

                <div className="p-6 space-y-4">
                    <p><strong>Status:</strong> {isExpired ? "Expired" : ticket.status}</p>
                    <p><strong>Location:</strong> {ticket.event_id.location || "Venue Name"}</p>
                    <p><strong>Number of Tickets:</strong> {ticket.ticket_count || 1}</p>
                    <div className="flex justify-center py-4">
                        <QRCode value={`Ticket ID: ${ticket._id}`} />
                    </div>
                </div>



                <div className="text-center pb-4 space-x-4">
                    <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => navigate(-1)}
                    >
                        ← Go Back
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="text-green-600 hover:underline text-sm"
                    >
                        📄 Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketView;
