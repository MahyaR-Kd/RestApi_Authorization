const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { create, getUserByEmail, getUsers, getUserById, updateUser, deleteUser, getUserByPhone, getUserByUserName } = require('./user.service');
const { sign } = require('jsonwebtoken')

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error!"
                });
            }
            if (results["rows"].length === 0) {
                return res.json({
                    success: 0,
                    message: "Failed user create!"
                });
            }
            return res.status(200).json({
                success: 1,
                email: results["rows"][0]["email"],
                message: "User created successfully!"
            });
        });
    },
    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (results["rows"].length === 0) {
                return res.json({
                    success: 0,
                    message: "Record not found!"
                });
            }
            return res.json({
                success: 1,
                data: results["rows"]
            });
        });
    },
    getUserByPhone: (req, res) => {
        const phone = req.params.phone;
        getUserByPhone(phone, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (results["rows"].length === 0) {
                return res.json({
                    success: 0,
                    message: "Record not found!"
                });
            }
            return res.json({
                success: 1,
                data: results["rows"]
            });
        });
    },
    getUserByUserName: (req, res) => {
        const username = req.params.username;
        getUserByUserName(username, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (results["rows"].length === 0) {
                return res.json({
                    success: 0,
                    message: "Record not found!"
                });
            }
            return res.json({
                success: 1,
                data: results["rows"]
            });
        });
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (results["rows"].length === 0) {
                return res.json({
                    success: 0,
                    message: "Record not found!"
                });
            }
            return res.json({
                success: 1,
                data: results["rows"]
            });
        });
    },
    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (results["rowCount"] === 0) {
                return res.json({
                    success: 0,
                    message: "Failed to update user!"
                });
            }
            return res.json({
                success: 1,
                message: "Update successfully"
            });
        });
    },
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err, results) => {
            console.log(results["rowCount"] == 0);
            if (err) {
                console.log(err);
                return;
            }
            if (results["rowCount"] == 0) {
                return res.json({
                    success: 0,
                    message: "Failed to deleted user!"
                });
            }
            if (results["rowCount"] == 1) {
                return res.json({
                    success: 1,
                    message: "User deleted successfully!"
                });
            }
        });
    },
    login: (req, res) => {
        const body = req.body;
        if (Object.keys(body).length == 2) {
            if (body.email) {
                console.log('email')
                getUserByEmail(body.email, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    if (!results) {
                        console.log(results)
                        return res.json({
                            success: 0,
                            message: "Invalid email or password!"
                        });
                    }
                    const result = compareSync(body.password, results.password);
                    if (result) {
                        results.password = undefined;
                        const jsontoken = sign({
                            email: results.email,
                            userId: results.id
                        }, "aqwesrxctvyibunizxrdctfvygbuh789645", {
                            expiresIn: "1h"
                        });
                        return res.json({
                            success: 1,
                            message: "login successfully",
                            token: jsontoken

                        });
                    } else {
                        return res.json({
                            success: 0,
                            message: "Invalid email or password!"
                        });
                    }

                });
            }
            if (body.phone) {
                console.log('phone')
                getUserByPhone(body.phone, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    if (!results) {
                        console.log(results)
                        return res.json({
                            success: 0,
                            message: "Invalid phone or password!"
                        });
                    }
                    const result = compareSync(body.password, results.password);
                    if (result) {
                        results.password = undefined;
                        const jsontoken = sign({
                            phone: results.phone,
                            userId: results.id
                        }, "aqwesrxctvyibunizxrdctfvygbuh789645", {
                            expiresIn: "1h"
                        });
                        return res.json({
                            success: 1,
                            message: "login successfully",
                            token: jsontoken

                        });
                    } else {
                        return res.json({
                            success: 0,
                            message: "Invalid phone or password!"
                        });
                    }

                })
            }
            if (body.username) {
                console.log('username')
                getUserByUserName(body.username, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    if (!results) {
                        console.log(results)
                        return res.json({
                            success: 0,
                            message: "Invalid username or password!"
                        });
                    }
                    const result = compareSync(body.password, results.password);
                    if (result) {
                        results.password = undefined;
                        const jsontoken = sign({
                            username: results.username,
                            userId: results.id
                        }, "aqwesrxctvyibunizxrdctfvygbuh789645", {
                            expiresIn: "1h"
                        });
                        return res.json({
                            success: 1,
                            message: "login successfully",
                            token: jsontoken

                        });
                    } else {
                        return res.json({
                            success: 0,
                            message: "Invalid phone or password!"
                        });
                    }

                })
            }
        }else{
            res.json({
                success: 0,
                message: "Your Enter Too Many Arguments!"

            })
        }
    }

}