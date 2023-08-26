import { Schema, model, models } from 'mongoose';
import { IUserModel } from '@/models/interfaces/user-model';

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
	},
	active: {
		type: Boolean,
		required: [true, 'Please provide if the user is active'],
		default: false
	}
});

const User = models.User || model('User', UserSchema);

export default User;
