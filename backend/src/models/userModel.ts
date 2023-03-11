import mongoose, { Schema } from 'mongoose';

interface IUser {
  username: string;
  homePage: string;
}

const UserScheme = new Schema<IUser>({
  username: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  homePage: Schema.Types.String,
});

const UserModel = mongoose.models.user as mongoose.Model<IUser> || mongoose.model<IUser>('user', UserScheme);

export default UserModel;
