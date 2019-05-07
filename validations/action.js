const Joi = require('joi');

const actionParam = {
    id: Joi.number().allow(null),
    action: Joi.string().required(),
    description: Joi.string().allow(null),
    parent: Joi.number().allow(null),
    isadmin: Joi.boolean().required()
}

module.exports = {actionParam};
