const express = require("express");
const { testControll, dummyControll } = require("../controllers/controlls");

const router = express.Router();
router.post("/testAPI", testControll)
router.post("/myAPI", dummyControll)

module.exports = router