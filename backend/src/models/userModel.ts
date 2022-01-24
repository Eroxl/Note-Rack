import mongoose, { Schema } from 'mongoose';

const UserScheme = new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  password: Schema.Types.String,
  verified: Schema.Types.Boolean,
});

const UserModel = mongoose.models.user || mongoose.model('user', UserScheme, 'User');

export default UserModel;
