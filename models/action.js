'use strict';

const { db_write, db_read } = require('../config/db');

let retrieveActions = async(qObj) => {
    var q = "SELECT * FROM action";
    var params = [];
    if(qObj.columns) {
        qObj.columns.forEach((query) => {
            if(q.substr(-1) == 'n') {
                q += " WHERE " + query.column + " = ?"
                params.push(query.param);
            } else {
                q += " AND " + query.column + " = ?"
                params.push(query.param);
            }
        });
    }
    if(qObj.page && qObj.sort) {
        q += " ORDER BY " + qObj.sort.by + " " + qObj.sort.sort
        q += " LIMIT " + (qObj.page.limit * qObj.page.page - qObj.page.limit).toString() + "," + qObj.page.limit.toString();
    }
    var actionExist = await db_read.query(q, params);
    return actionExist[0];
} 

let transactQueries = async(queriesAndParams) => {
    const conn = await db_write.getConnection();
    await conn.beginTransaction();
    try {
        queriesAndParams.forEach(async (q) => {
            await conn.query(q.query, q.params);
        });
        conn.commit();
    } catch (e) {
        await conn.rollback();
        console.log(e);
        throw e;
    } finally {
        await conn.release();
    }
}

let createAction = async (action) => {
    return await transactQueries([{
        query: "INSERT INTO action (action, description, parent, is_admin) VALUES (?, ?, ?, ?)",
        params: [action.action, action.description, action.parent?action.parent:null , action.isadmin == "true"? 1: 0]
    }]);
}

let modifyAction = async (action, actionId) => {
    var result =  await retrieveActions({columns: [{column:"action_id", param: actionId}]});
    if(result.length ===1) {
        await transactQueries([{
            query: "UPDATE action SET action = ?, description = ?, parent = ?, is_admin = ? WHERE action_id = ?",
            params: [action.action, action.description, action.parent?action.parent:null,
                    action.isadmin == "true"? 1: 0, actionId]
        }]);
        return true;
    } else {
        return false;
    }
    
}

let removeAction = async (actionId) => {
    var result =  await retrieveActions({columns: [{column: "action_id", param: actionId}]});
    if(result.length ===1) {
        await transactQueries([{
            query: "DELETE FROM action WHERE action_id = ? or parent = ?",
            params: [actionId, actionId]
        }]);
        return true;
    } else {
        return false;
    }
}

let findById = async (actionId) => {
    let result = await retrieveActions({columns: [{column: "action_id", param: actionId}]});
    return result;
}

let mapQuery = (query) => {
    var q = {};

    if(query.page) {
       q.page = {page: query.page}
    } else {
        q.page = {page: 1}
    }
    if(query.limit) {
        q.page.limit = query.limit;
    } else {
        q.page.limit = 5;
    }
    if(query.sort && ['ASC','DESC'].includes(query.sort.toUpperCase()) && query.sortby) {
        q.sort = {sort: query.sort, by: query.sortby}
     } else {
         q.sort = {sort: 'ASC', by: 'action_id'}
     }

    return q;
}

let findActions = async (query) => {
    let qObj = mapQuery(query);
    let result = await retrieveActions(qObj);
    return {query: qObj, result: result}
}

module.exports = {createAction, modifyAction, removeAction, findById, findActions};