const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../model/User");
const History = require("../model/History");
const bcrypt = require("bcryptjs");
const comma = require("../utils/comma")

router.get("/dashboard", (req, res) => {
    try {
        return res.render("dashboard", { res, pageTitle: "Dashbaord", req, comma, layout: false });
    } catch (err) {
        return res.redirect("/");
    }
});

module.exports = router;