const express = require("express");
const appAuth = express();

const dovent = require("dotenv");
dovent.config();

const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;

const cors = require("cors");
appAuth.use(cors());

const bodyParser = require("body-parser");
appAuth.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const tigetSecret = process.env.TIGET_SECRET;

appAuth.post("/auth", (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    console.log("Auth request => ", token);
    const decoded = jwt.verify(token, tigetSecret, (err, decoded) => {
        if (err) {
            res.json({ status: "error", message: "Token invalid" });
            return;
        }
        if(decoded.exp < Date.now() / 1000){
            res.json({ status: "error", message: "Token expired" });
            return;
        }
        return decoded;
    });


    if (decoded) {
        res.json({ status: "ok", message: "Auth successfully", decoded: decoded });
        console.log("Auth successfully => ", decoded);
        return;
    } else {
        res.json({ status: "error", message: "Auth failed" });
        return;
    }
});

module.exports = { appAuth };