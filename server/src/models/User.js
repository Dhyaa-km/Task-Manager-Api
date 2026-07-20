const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    refreshToken: {
        type: String
    },
    avatar: {
        type: String
    },
    timestamps: {
        type: Date,
        default: Date.now
    }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);