import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  enrolledClasses: [Schema.Types.ObjectId],
});

const User = mongoose.model('User', userSchema);
export default User;
