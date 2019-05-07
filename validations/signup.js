const Joi = require('joi');

const signUpParam = {
    body: {
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required(),
        firstname: Joi.string().required(),
        middlename: Joi.string().required(),
        lastname: Joi.string().required(),
        birthdate: Joi.date().required()
    }
}

module.exports = { signUpParam };