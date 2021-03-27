const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { create, getUserByEmail, getUsers, getUserById, updateUser, deleteUser, getUserByPhone, getUserByUserName } = require('./user.service');
const { sign } = require('jsonwebtoken')

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        getUserByEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                getUserByPhone(body.phone, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        getUserByUserName(body.username, (err, results) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (!results) {
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
                            } else {
                                return res.json({
                                    success: 0,
                                    message: "Failed User Usename Exist!"
                                });
                            }
                        });
                    } else {
                        return res.json({
                            success: 0,
                            message: "Failed User Phone Exist!"
                        });
                    }
                });
            } else {
                return res.json({
                    success: 0,
                    message: "Failed User Email Exist!"
                });
            }
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
        const body = req.body;
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
                    deleteUser(results, (err, results) => {
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
            
                } else {
                    return res.json({
                        success: 0,
                        message: "Invalid phone or password!"
                    });
                }

            })
        }

    },
    login: (req, res) => {
        const body = req.body;
        const username = body.username;
        let email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let phone = /^(0)?([ 0-9]){11}$/;
        let user = /\w+\D/;

        if (Object.keys(body).length == 2) {
            let email_result = email.test(username)
            let phone_result = phone.test(username)
            let username_result = user.test(username)

            console.log(email_result)
            console.log(phone_result)
            console.log(username_result)
            
            if (email_result) {
                console.log('email')
                getUserByEmail(username, (err, results) => {
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
            else if (phone_result) {
                console.log('phone')
                getUserByPhone(username, (err, results) => {
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
            else if (username_result) {
                console.log('username')
                getUserByUserName(username, (err, results) => {
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
            else {
                res.json({
                    success: 0,
                    message: "Your Enter Not Valid!"
    
                })
            }
        } else {
            res.json({
                success: 0,
                message: "Your Enter Too Many Arguments!"

            })
        }
    }

}