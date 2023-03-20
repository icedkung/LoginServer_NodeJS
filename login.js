const express = require("express");
const appLogin = express();

const dovent = require("dotenv");
dovent.config();

const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;

const cors = require("cors");
appLogin.use(cors());

const bodyParser = require("body-parser");
appLogin.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const tigetSecret = process.env.TIGET_SECRET;





const { dbEvent } = require("./db/dbEvent.js");


appLogin.post("/login", (req, res) => {
    const { username, password, keepMeSignedIn } = req.body;
    dbEvent.userFindWhereUsername(username, (err, rows) => {
        if (err) {
            res.json({ status: "error", message: "Error when connecting the database" });return;
        } else {
            if (rows.length > 0) {
                bcrypt.compare(password, rows[0].password, (err, result) => {
                    if (err) {
                        res.json({ status: "error", message: "Error when comparing the password" });return;
                    } else {
                        if (result) {
                            if (keepMeSignedIn) {
                                var token = jwt.sign({ username: username }, tigetSecret, { expiresIn: "1d" });
                            } else {
                                var token = jwt.sign({ username: username }, tigetSecret, { expiresIn: "1h" });
                            }
                            res.json({ status: "ok", message: "Login successfully", token:token, keepSignIn: keepMeSignedIn });return;
                        } else {
                            res.json({ status: "error", message: "Wrong password" });return;
                        }
                    }
                });
            } else {
                res.json({ status: "error", message: "User not found" }); return;
            }
        }
    });
});

module.exports = { appLogin };