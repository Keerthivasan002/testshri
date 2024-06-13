const express = require("express");
const router = require("./routes/router");
require("dotenv").config()
const app = express();

app.use(express.json())
app.use("/", router)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server started");
})