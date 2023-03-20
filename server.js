const express = require("express");
const app = express();
const port = 3333;

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const db = require("sqlite3").verbose();
const userDB = "./db/user.db";
const userDBConnection = new db.Database(userDB);

const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;

const jwt = require("jsonwebtoken");
const tigetSecret = process.env.TIGET_SECRET;

const { dbEvent } = require("./db/dbEvent.js");

const { appRegister } = require("./register.js");
app.use(appRegister);

const { appLogin } = require("./login.js");
app.use(appLogin);

const { appAuth } = require("./auth.js"); 
app.use(appAuth);

app.get("/", (req, res) => {
    res.send({ status:"ok", message: "TIGET IS READY!" });
});

app.get("/users" , (req, res) => {
    dbEvent.getAllUser((err, rows) => {
        if (err) {
            res.json({ status:"err", message: "Database error please try again later!" });
            } else {
                res.json({ status:"ok", message: "Get all users successfully", data: rows });
            }
        }
    );
});



app.get("/users", (req, res) => {
    const token = req.headers["authorization"];
    const username  = jwt.verify(token, tigetSecret).username;
    dbEvent.userFindWhereUsername(username, (err, rows) => {
        if (err) {
            res.send({ status: "error", message: "Error when connecting the database" });
        } else {
            if (rows.length > 0) {
                if (rows[0].role === "admin") {
                    dbEvent.userFindAll((err, rows) => {
                        if (err) {
                            res.send({ status: "error", message: "Error when connecting the database" });
                        } else {
                            res.send({ status: "ok", message: "Get all users successfully", users: rows });
                        }
                    });
                } else {
                    res.send({ status: "error", message: "You are not admin" });
                }
            } else {
                res.send({ status: "error", message: "User not found" });
            }
        }
    });
});
try{
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
} catch (err) {
    console.log(err);
}