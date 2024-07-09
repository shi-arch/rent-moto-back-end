const express = require("express");

const loginRoute = require("./login.router");
const accountRoute = require("./account.routes");
const chatRoute = require("./chat.router");

const router = express();

router.use("/api", loginRoute);
router.use("/api", accountRoute);
router.use("/api", chatRoute);


//Images routes
module.exports = router;
