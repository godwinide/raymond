const router = require("express").Router();
const User = require("../model/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const path = require("path");

router.get("/login", (req, res) => {
    try {
        return res.render("login", { pageTitle: "Login", res });
    } catch (err) {
        return res.redirect("/");
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

router.get("/register", (req, res) => {
    try {
        return res.render("register", { pageTitle: "Register", res });
    } catch (err) {
        return res.redirect("/");
    }
});

router.post('/register', async (req, res) => {
    try {
        const {
            username,
            fullname,
            email,
            phone,
            country,
            password,
            password2
        } = req.body;
        console.log(req.body)
        const userIP = req.ip;
        const user = await User.findOne({ email, username });
        const user1 = await User.findOne({ username });
        if (user || user1) {
            return res.render("register", { ...req.body, error_msg: "A User with that email or username already exists", pageTitle: "register" });
        } else {
            if (!username || !fullname || !gender || !country || !currency || !security_question || !security_answer || !email || !phone || !password || !password2) {
                return res.render("register", { ...req.body, res, error_msg: "Please fill all fields", pageTitle: "register" });
            } else {
                if (password !== password2) {
                    return res.render("register", { ...req.body, res, error_msg: "Both passwords are not thesame", pageTitle: "register" });
                }
                if (password2.length < 6) {
                    return res.render("register", { ...req.body, res, error_msg: "Password length should be min of 6 chars", pageTitle: "register" });
                }
                const newUser = {
                    username: username.trim(),
                    fullname,
                    email,
                    phone,
                    gender,
                    currency,
                    security_question,
                    security_answer,
                    country,
                    password: password.trim(),
                    clearPassword: password,
                    userIP
                };
                const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(password2, salt);
                newUser.password = hash;
                const _newUser = new User(newUser);
                await _newUser.save();
                req.flash("success_msg", "Register success, you can now login");
                return res.redirect("/login");
            }
        }
    } catch (err) {
        console.log(err)
    }
})



module.exports = router;