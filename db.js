// Database functions module
import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

let connection;

exports.init = () => {
    dotenv.config();
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: "video_sharing"
    });
    connection.connect();
};

exports.terminate = () => {
    connection.end();
};

exports.authenticate = (username, pwd, func) => {
    connection.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err)
            func(err);

        if (!results.length)
            func();

        bcrypt.compare(pwd, results[0].pwd, (e, res) => {
            if (e) throw e;

            if (!res) func();
            func(null, results[0]);
        });
    });
};

exports.register = (username, pwd, name, func) => {
    connection.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        // First check if user exists already.
        if (err)
            func(err);

        if (results.length)
            func(null, {
                success: false,
                message: "Username already exists."
            });
    });

    // Gotta hash the password first!
    bcrypt.hash(pwd, 10, (e_, hash) => {
        if (e_)
            func(e_);

        connection.query("INSERT INTO users (name, username, pwd) VALUES (?, ?, ?)", [name, username, hash], (err) => {
            if (err) {
                // Can't simply throw an error here, return an error message instead.
                func(null, {
                    success: false,
                    message: "Unknown error occurred, try again."
                });
            }

            // No error, inserted successfully, so return true.
            func(null, {
                success: true,
                message: "Successfully registered!"
            });
        });
    });
};

module.exports = exports;
