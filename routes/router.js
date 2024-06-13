const express = require("express");
const { testControll } = require("../controllers/controlls");

const router = express.Router();
router.post("/testAPI", testControll)

module.exports = router