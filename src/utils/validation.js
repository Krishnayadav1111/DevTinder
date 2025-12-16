const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("Missing required fields");
    }
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name must be between 4 and 50 characters");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }
    else if(!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error("Password is not strong enough");
    }
}

const validateEditProfileData = (req) => {
    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName',"emailId" ,'age', 'gender', 'photoUrl', 'about', 'skills'];
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));  
    
    if (!isValidOperation) {
        throw new Error('Invalid updates!');
    }
    return true;
}

module.exports = { validateSignUpData ,validateEditProfileData};