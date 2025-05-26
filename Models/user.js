const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 1024
        },
        role: {
            type: String,
            enum: ["User", "Organizer", "Admin"],
            default: "User",
        },
        profilePicture: {
            type: String,
            default: "Resources/default.jpg",  // Use forward slash for paths
        },
        mfaCode: {
            type: String,
            default: null
        },
        mfaCodeExpires: {
            type: Date,
            default: null
        }
    }, {
    timestamps: true  // Move this to the schema options
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
