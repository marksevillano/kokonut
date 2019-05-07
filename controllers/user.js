const config = require('../config/app');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const Hash = require('crypto-js/pbkdf2');

async function signUp(req, res) {
    try {
        await User.createUser(req.body);
        return res.json({
            message: "success",
            data: "Inserted data successfully."
        });
    } catch (err) {
        return res.status(500).json({
            status: "500",
            message: err
        });
    }
}

module.exports = { signUp };