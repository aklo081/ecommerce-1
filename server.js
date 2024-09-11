const express = require("express");
const connectDB = require("./config/db");
const categoryRouters = require("./routers/categoryRouters")
const productRouters = require("./routers/productRouters")
const authRouters = require('./routers/authRouters');
const cartRouters = require('./routers/cartRouters');
const orderRouters = require('./routers/orderRouters');
const dotenv = require('dotenv');
const cors = require("cors")
const app = (express());
app.use(express.json());

dotenv.config()
connectDB()

app.use(cors({
    origin: ["http://localhost:5173", ""],
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
    methods: [ "GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use(express.json());
app.use("/uploads", express.static("uploads"))
app.use("/", categoryRouters)
app.use("/", productRouters)
app.use("/", authRouters)
app.use("/", cartRouters)
app.use("/", orderRouters)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`)
)