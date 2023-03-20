const db = require("sqlite3").verbose();
const path  = require("path");
const userDbPath = path.join(__dirname, "./user.db");

const dbEvent = {
    getAllUser: function (callback) {
        let dbCon = new db.Database(userDbPath, db.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("Error when connecting the database" + err);
                callback(err, "Error when connecting the database");
            }
        });

        dbCon.serialize(function () {
            dbCon.all("SELECT username, email, fname, lname, role FROM user", function (err, rows) {
                callback(false, rows);
            });
        });

        dbCon.close();
    },
    userFindWhereUsername: function (username, callback) {
        let dbCon = new db.Database(userDbPath, db.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("Error when connecting the database" + err);
                callback(err, "Error when connecting the database");
            }
        });

        dbCon.serialize(function () {
            dbCon.all("SELECT * FROM user WHERE username = ?", [username], function (err, rows) {
                callback(false, rows);
            });
        });

        dbCon.close();
    },
    userFindWhereEmail: function (email, callback) {
        let dbCon = new db.Database(userDbPath, db.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("Error when connecting the database" + err);
                callback(err, "Error when connecting the database");
            }
        });

        dbCon.serialize(function () {
            dbCon.all("SELECT * FROM user WHERE email = ?", [email], function (err, rows) {
                callback(false, rows);
            });
        });

        dbCon.close();
    },
    createDBifNotExit: function (callback) {
        let dbCon = new db.Database(userDbPath, db.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("Error when creating the database" + err);
                callback(err, "Error when creating the database");
            }
        });

        dbCon.serialize(function () {
            dbCon.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), email VARCHAR(50), password VARCHAR(255), fname VARCHAR(50), lname VARCHAR(50), role VARCHAR(10) DEFAULT 'user')");
            callback(false, "DB created successfully");
        });

        dbCon.close();
    }, 
    insertUser: function (username, email, password, fname, lname, callback) {
        let dbCon = new db.Database(userDbPath, db.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("Error when creating the database" + err);
            }
        });
    
        dbCon.serialize(function () {
            dbCon.run("INSERT INTO user (username, password, email, fname, lname) VALUES (?, ?, ?, ?, ?)", 
       [username, password, email, fname, lname], 
       function(err) {
            if (err) {
                console.log("Error when inserting the user: ", err);
            } else {
                console.log("New user inserted successfully with ID:", this.lastID);
                callback(false, "New user inserted successfully with ID:" + this.lastID);
            }
       });
    });

    dbCon.close();
    },
        
}



module.exports = { dbEvent };
