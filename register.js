const express = require("express");
const appRegister = express();

const dovent = require("dotenv");
dovent.config();

const cors = require("cors");
appRegister.use(cors());

const bodyParser = require("body-parser");
appRegister.use(bodyParser.json());

const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;


const jwt = require("jsonwebtoken");
const tigetSecret = process.env.TIGET_SECRET;

const { dbEvent } = require("./db/dbEvent.js");

dbEvent.createDBifNotExit((err, rows) => {
    if (err) {
        console.log("Error when creating database");
        } else {
            console.log("Database created");
        }
    }
);

appRegister.post("/register", (req, res) => {
    console.log("Request => ", req.body);
    const { username, email, password, fname, lname } = req.body;

    if(!username || !email || !password || !fname || !lname){
        res.json({ message: "missing : " + (!username ? "username" : !email ? "email" : !password ? "password" : !fname ? "fname" : "lname") + " field" });
        return;
    }

    dbEvent.userFindWhereUsername(username, (err, rows) => {
        if (err) {
            res.json({ status:"err", message: "Error when checking username" });
        } else {
            if (rows.length > 0) {
                res.json({ status:"err", message: "Username already exists" });
            } else {
                dbEvent.userFindWhereEmail(email, (err, rows) => {
                    if (err) {
                        res.json({ status:"err",message: "Error when checking email" });
                    } else {
                        if (rows.length > 0) {
                            res.json({ status:"err", message: "Email already exists" });
                        } else {
                            bcrypt.hash(password, saltRounds, (err, hash) => {
                                if (err) {
                                    res.json({ status:err, message: "Error when hashing password" });
                                } else {
                                    dbEvent.insertUser(username, email, hash, fname, lname, (err, msg) => {
                                        if (err) {
                                            res.json({ status:err, message: "Error when inserting user" });
                                        }
                                        else {
                                            res.json({ status:"ok", message: "User created successfully", data: msg });
                                        }

                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});



module.exports = { appRegister };