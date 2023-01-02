import mongoose, { Schema } from 'mongoose';

const UserScheme = new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  homePage: Schema.Types.String,
});

const UserModel = mongoose.models.user || mongoose.model('user', UserScheme, 'User');

export default UserModel;
