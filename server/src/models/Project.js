const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Project', projectSchema);