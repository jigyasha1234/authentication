const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVTAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
    },
    accessToken:
    {
        type: String,
        default: 'abc123'
    },
    isTokenValid:
    {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVTAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });

// static method
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath = AVTAR_PATH;

const User = mongoose.model('User',userSchema);
module.exports = User;