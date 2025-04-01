const express=require('express');
const path=require('path');
const cors=require('cors');
const connectDB=require("./config/db")
const userRoutes=require("./routes/userRoutes")
const privateEventRoutes=require("./routes/privateEventRoutes")
const vendorRoutes=require("./routes/vandorRoutes")
const organizerRoutes=require("./routes/organizerRoutes")
const adminRoutes=require("./routes/adminRoutes")
const paymentRoutes=require("./routes/paymentRoutes")
const publicEventRoutes=require("./routes/publicEventRoutes")
const ticketRoutes=require("./routes/ticketRoutes")
const vendorAssignmentRoutes=require("./routes/vendorAssignmentRoutes")

const app=express();

const port=5000

app.use(cors({
    origin:"*",
    credentials:true
}));
app.use(express.json())

connectDB()

app.use("/uploads", express.static("public/uploads"));

app.use("/api/users",userRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/privateEvents",privateEventRoutes)
app.use("/api/vendors",vendorRoutes)
app.use("/api/organizers",organizerRoutes)
app.use("/api/payment",paymentRoutes)
app.use("/api/publicEvents",publicEventRoutes)
app.use("/api/tickets",ticketRoutes)
app.use("/api/vendorAssignments",vendorAssignmentRoutes)


app.listen(port,()=>console.log(`server listening on port ${port} 🚀`))