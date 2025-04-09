import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IoMdDownload } from "react-icons/io";

const AdminReports = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef();

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/report", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }); // Adjust path as needed
                setReport(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching report:", err);
                setLoading(false);
            }
        };

        fetchReport();
    }, []);



    const generatePDF = () => {
        const input = reportRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("admin_report.pdf");
        });
    };

    if (loading) return <p>Loading report...</p>;
    if (!report) return <p>No data available</p>;

    return (
        <div style={{ padding: "1rem" }}>
            <button onClick={generatePDF} style={{display:"flex",gap:"10px", alignItems:"center",justifyContent:'center', marginBottom: "1rem", padding: "8px 12px", border:"1px solid black",boxShadow:"0px 0px 4px 2px",borderRadius:"8px" }}>
                Download PDF
            <IoMdDownload/>
            </button>
            <h2>Admin Consolidated Report</h2>

            <div ref={reportRef}>
                {/* Table Wrapper Style */}
                <div style={{ border: "2px solid #333", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
                    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                        <thead style={{ backgroundColor: "#eee" }}>
                            <tr>
                                <th>Total Events</th>
                                <th>Approved</th>
                                <th>Pending</th>
                                <th>Rejected</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{report.totalEvents}</td>
                                <td>{report.approvedEvents}</td>
                                <td>{report.pendingEvents}</td>
                                <td>{report.rejectedEvents}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* User-wise Stats */}
                <h3>User-wise Event Count</h3>
                <div style={{ border: "2px solid #333", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
                    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                        <thead style={{ backgroundColor: "#f5f5f5" }}>
                            <tr>
                                <th>User Name</th>
                                <th>Event Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.userWiseStats.map((user, idx) => (
                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f0f0f0" }}>
                                    <td>{user.name}</td>
                                    <td>{user.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Vendor Usage */}
                <h3>Vendor Usage</h3>
                <div style={{ border: "2px solid #333", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
                    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                        <thead style={{ backgroundColor: "#f5f5f5" }}>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Usage Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.vendorUsage.map((vendor, idx) => (
                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f0f0f0" }}>
                                    <td>{vendor.name}</td>
                                    <td>{vendor.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Upcoming Events */}
                <h3>Upcoming Events</h3>
                <div style={{ border: "2px solid #333", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
                    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                        <thead style={{ backgroundColor: "#f5f5f5" }}>
                            <tr>
                                <th>Event Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.upcomingEvents.map((event, idx) => (
                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f0f0f0" }}>
                                    <td>{event.event_name || event.event_type}</td>
                                    <td>{new Date(event.event_date).toLocaleDateString()}</td>
                                    <td>{event.event_status || event.status}</td>
                                    <td>
                                        {event.user_id
                                            ? `user: ${event.user_id.name}`
                                            : event.organizer_id
                                                ? `organizer: ${event.organizer_id.name}`
                                                : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );

};

export default AdminReports;
