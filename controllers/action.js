const config = require('../config/app');
const jwt = require('jsonwebtoken')
const Hash = require('crypto-js/pbkdf2');
const action = require('../models/action');


let addAction = async (req, res) => {
    try {
       await action.createAction(req.body);
       return res.json({
            status: "200",
            message: "Inserted action successfully."
        });
    } catch (e) {
        return res.status(500).json({
            status: "500",
            message: e
        });
    }
}

let updateAction = async (req, res) => {
    try {
        var result = await action.modifyAction(req.body, req.params.id);
        if(result) {
            return res.json({
                status: "200",
                message: "Updated action successfully."
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: "Action not existing."
            });
        }       
    } catch (e) {
        return res.status(500).json({
            status: "500",
            message: e
        });
    }
}

let deleteAction = async (req, res) => {
    try {
        var result = await action.removeAction(req.params.id);
        if(result) {
            return res.json({
                status: "200",
                message: "Deleted action successfully."
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: "Action not existing."
            });
        }       
    } catch (e) {
        return res.status(500).json({
            status: "500",
            message: e
        });
    }
}

let findAction = async (req, res) => {
    try {
        var result = await action.findById(req.params.id);
        if(result.length === 1) {
            return res.json({
                status: "200",
                message: "Retrieved successfully",
                result: result[0]
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: "Action not existing."
            });
        }       
    } catch (e) {
        return res.status(500).json({
            status: "500",
            message: e
        });
    }
}

let retrieveActions = async (req, res) => {
    try {
        var result = await action.findActions(req.query);
        if(result.result.length > 0) {
            return res.json({
                status: "200",
                message: "Retrieved successfully",
                data: result
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: "No Actions found.",
                data: []
            });
        }       
    } catch (e) {
        return res.status(500).json({
            status: "500",
            message: e
        });
    }
}

module.exports = {addAction, updateAction, deleteAction, findAction, retrieveActions};
