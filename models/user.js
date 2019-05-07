'use strict';

const { db_write, db_read } = require('../config/db');
const Hash = require('crypto-js/pbkdf2');
const config = require('../config/app');

// User object constructor
const User = data => {
    this.username = data.username;
    this.firstname = data.firstname;
    this.middlename = data.middlename;
    this.lastname = data.lastname;
    this.email = data.email;
    this.birthdate = data.birthdate;
    this.password = data.password;
    this.created_at = new Date();
    this.updated_at = new Date();
}

User.findById = async (userId) => {
    try {
       var result = await db_read.query("SELECT * FROM user WHERE user_id = ?", userId);
       return result[0];  
    } catch (err) {
        console.log("err2", err);
    }
};

User.createUser = async (userData) => {
    var pword = Hash(userData.password, config.appSecret).toString();
    try {
        return await db_write.query("INSERT INTO user (email, firstname, middlename, lastname, birthdate, password, created_at, updated_at)" + 
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [userData.email, userData.firstname, 
            userData.middlename, userData.lastname, userData.birthdate, pword, User.created_at, User.updated_at]);   
    } catch(err) {
        console.log("err2",err);
    }
};

module.exports = User;
