const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


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

const User = mongoose.model('User', userSchema);

module.exports = { User };