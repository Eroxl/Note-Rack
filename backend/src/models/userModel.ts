import mongoose, { Schema } from 'mongoose';

const UserScheme = new Schema({
  _id: Schema.Types.ObjectId,
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
});

const UserModel = mongoose.models.user || mongoose.model('user', UserScheme, 'User');

export default UserModel;
