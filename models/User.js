const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    role: {
        type: String,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExpiration: {
        type: Number
    }
})

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
        } catch (err) {
            throw err; // 에러가 나면 save 과정이 중단됩니다.
        }
    }
})

userSchema.methods.comparePassword = async function (plainPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}

userSchema.methods.generateAuthToken = async function () {
    try {
        const user = this;

        const jwtToken = jwt.sign( user._id.toHexString(), 'secretToken');

        user.token = jwtToken;
        const userInfo = await user.save();

        return userInfo;
    } catch (err) {
        throw err;
    }
}
const User = mongoose.model('User', userSchema);

module.exports = { User };