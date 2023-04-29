const fieldFormatValidator = (field) => (schema) => (req, res, next) => {    
    const { error } = schema.validate(req[field]);
    if (error) {
        res.status(422).json({ errormessage: error.details[0].message });
    } else {
        next();
    }
};

module.exports = { fieldFormatValidator }