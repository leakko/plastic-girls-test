import { Schema, model, models } from 'mongoose';

interface IUserModel {
	email: string;
	password: string;
}

const UserSchema = new Schema<IUserModel>({
	email: {
		type: String,
		required: [true, 'Please provide an email address'],
		unique: true,
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email address'],
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		select: false,
	},
});

const User = models.User || model('User', UserSchema);

export default User;
