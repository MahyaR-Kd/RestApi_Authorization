const pool = require('../../config/database');


module.exports = {
    create: (data, callback) => {
        pool.query(
            "INSERT INTO api_users (firstname,lastname,email,phone,username,password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;",
            [
                data.firstname,
                data.lastname,
                data.email,
                data.phone,
                data.username,
                data.password
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        );
    },
    getUsers: callback => {
        pool.query(
            "SELECT id,firstname,lastname,email,phone,username,password FROM api_users",
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    getUserById: (id, callback) => {
        pool.query(
            "SELECT id,firstname,lastname,email,phone,username,password FROM api_users WHERE id = $1",
            [id],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    getUserByEmail: (email, callback) =>{
        pool.query("SELECT * FROM api_users WHERE email=($1);",
        [email],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results["rows"][0]);
        }
        )
    },
    getUserByPhone: (phone, callback) =>{
        pool.query("SELECT * FROM api_users WHERE phone=($1);",
        [phone],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results["rows"][0]);
        }
        )
    },
    getUserByUserName: (username, callback) =>{
        pool.query("SELECT * FROM api_users WHERE username=($1);",
        [username],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results["rows"][0]);
        }
        )
    },
    updateUser: (data, callback) => {
        pool.query(
            "UPDATE api_users SET firstname=$1, lastname=$2, email=$3, phone=$4, username=$5, password=$6 WHERE id=$7",
            [
                data.firstname,
                data.lastname,
                data.email,
                data.phone,
                data.username,
                data.password,
                data.id

            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    deleteUser: (data, callback) => {
        pool.query(
            "DELETE FROM api_users WHERE id = $1",
            [data.id],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
};
