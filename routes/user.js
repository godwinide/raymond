const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../model/User");
const History = require("../model/History");
const bcrypt = require("bcryptjs");
const comma = require("../utils/comma");
const Deposit = require("../model/Deposit");
const uuid = require("uuid");
const Withdraw = require("../model/Withdraw");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    try {
        return res.render("dashboard", { res, pageTitle: "Dashboard", req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.get("/deposit", ensureAuthenticated, async (req, res) => {
    try {
        const deposits = await Deposit.find({ userID: req.user.id });
        return res.render("deposit", { res, pageTitle: "Deposit", deposits, req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.post("/deposit", ensureAuthenticated, async (req, res) => {
    try {
        const {
            method,
            amount
        } = req.body;

        if (!method || !amount) {
            req.flash("error_msg", "Fill mandatory fields");
            return res.redirect("/deposit");
        }

        const reference = uuid.v1().split("-").slice(0, 3).join("");

        const newDeposit = new Deposit({
            amount: Number(amount),
            method,
            userID: req.user.id,
            user: req.user,
            reference
        });

        const newHistory = new History({
            amount: Number(amount),
            method,
            userID: req.user.id,
            user: req.user,
            reference
        });


        await newDeposit.save();
        await newHistory.save();

        req.flash("success_msg", "Your deposit request has been submitted successfully!");
        return res.redirect("/deposit");
    } catch (err) {
        console.log(err)
        return res.redirect("/dashboard");
    }
});

router.get("/withdraw", ensureAuthenticated, async (req, res) => {
    try {
        const withdrawals = await Withdraw.find({ userID: req.user.id });
        return res.render("withdraw", { res, pageTitle: "Deposit", withdrawals, req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.post("/withdraw", ensureAuthenticated, async (req, res) => {
    try {
        const {
            method,
            amount,
            wallet
        } = req.body;


        if (!method || !amount || !wallet) {
            req.flash("error_msg", "Fill mandatory fields");
            return res.redirect("/withdraw");
        }

        if (Number(amount) > Number(req.user.balance)) {
            req.flash("error_msg", "Insufficient funds");
            return res.redirect("/withdraw");
        }

        const reference = uuid.v1().split("-").slice(0, 3).join("");

        const newWithdraw = new Withdraw({
            amount: Number(amount),
            method,
            userID: req.user.id,
            user: req.user,
            reference
        });

        const newHistory = new History({
            amount: Number(amount),
            method,
            userID: req.user.id,
            user: req.user,
            reference
        });

        await newWithdraw.save();
        await newHistory.save()
        await User.updateOne({ _id: req.user.id }, {
            balance: req.user.balance - Number(amount)
        })

        req.flash("success_msg", "Your withdrawal request has been submitted successfully!");
        return res.redirect("/withdraw");
    } catch (err) {
        console.log(err)
        return res.redirect("/dashboard");
    }
});

router.get("/upgrade", ensureAuthenticated, (req, res) => {
    try {
        return res.render("upgrade", { res, pageTitle: "Deposit", req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.get("/transactions", ensureAuthenticated, async (req, res) => {
    try {
        const transactions = await History.find({ userID: req.user.id });
        return res.render("transaction", { res, pageTitle: "Transactions", transactions, req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.get("/trade-history", ensureAuthenticated, (req, res) => {
    try {
        return res.render("tradeHistory", { res, pageTitle: "Trade History", req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.get("/update-password", ensureAuthenticated, (req, res) => {
    try {
        return res.render("updatePassword", { res, pageTitle: "Update Password", req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.post("/update-password", ensureAuthenticated, async (req, res) => {
    try {
        const { currentPassword, password, password2 } = req.body;

        if (!currentPassword || !password || !password2) {
            req.flash("error_msg", "Please fill all fields!");
            return res.redirect("/update-password");
        }

        if (password.length < 8) {
            req.flash("error_msg", "Password should be at least 8 characters long");
            return res.redirect("/update-password");
        }

        if (password !== password2) {
            req.flash("error_msg", "Passwords do not match");
            return res.redirect("/update-password")
        }

        const isMatch = await bcrypt.compare(currentPassword, req.user.password);

        if (!isMatch) {
            req.flash("error_msg", "Current password is incorrect");
            return res.redirect("/update-password");
        }

        return res.render("updatePassword", { res, pageTitle: "Update Password", req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});


router.get("/top-investors", ensureAuthenticated, (req, res) => {
    try {
        return res.render("topInvestor", { res, pageTitle: "Top Investors", req, comma, layout: "layout2" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});





module.exports = router;