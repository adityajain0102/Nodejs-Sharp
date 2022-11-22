const mongoose = require('mongoose');
const constantsObj = require('../../../../../lib/constants');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    email: {
        type: String, lowercase: true, default: '',
        unique: true, index: true, required: [true, 'Please enter Email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },  //unique: true,
    password: { type: String, default: null, required: [true, 'Please Enter Password'], },
    isDeleted: { type: Boolean, default: false },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: Date,
    first_name: { type: String, default: '', maxlength: [50, 'Max length of First Name can not be greater than 50'] },
    last_name: { type: String, default: '', maxlength: [50, 'Max length of Last Name can not be greater than 50'] },
    phone: {
        type: String, default: null, trim: true,
        match: [/^\+\d{1,3}-\d{7,10}$/, 'Please Enter a valid phone number!']
    },
   
    isActive: { type: Boolean, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});



userSchema.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
};
userSchema.methods.getjwtsigntoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SCREATE, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

var user = mongoose.model('user', userSchema);
module.exports = user;

