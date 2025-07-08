import mongoose from 'mongoose';
import ROLES_ARRAY from "./reference-data-files/roles.json" with { type: 'json' };


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    required: true,
    default: false
  },
  permissions: {
    type: [String],
    required: true,
    enum: ROLES_ARRAY
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;