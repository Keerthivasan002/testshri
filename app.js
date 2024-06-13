const express = require("express");
const router = require("./routes/router");
require("dotenv").config()
const app = express();

app.use(express.json())
app.use("/", router)
app.listen(3000, () => {
    console.log("Server started");
})