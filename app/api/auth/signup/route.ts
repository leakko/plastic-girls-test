import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import mongoose, { Connection } from 'mongoose';
import { hash } from 'bcryptjs';
import User from '@/models/user';
import { IUser } from '@/types/index';

const handler = async (req: Request) => {
	let connection: Connection | null;
	try {
		await connectToMongoDB()
	} catch (error) {
		return new NextResponse(error as string, {
			status: 500
		})
	}

	let body: IUser;
	try {
		body = await req.json();
	} catch(e) {
		return new NextResponse('No body provided', { status: 400 });
	}

	const { email, password } = body;

	if(!email) return new NextResponse('No email provided', { status: 400 });

	const user = await User.findOne({ email });

	if (user) {
		return new NextResponse('User already exists', { status: 409 });
	} else {
		if (!password) {
			return new NextResponse('No password provided', { status: 400 });
		}
		if (password.length < 8) {
			return new NextResponse('Password must be at least 8 characters long', { status: 400 });
		}
		const hashedPassword = await hash(password, 10);

		try {
			const data = await User.create({
				email,
				password: hashedPassword
			})
			const user = {
				email: data.email,
				_id: data._id
			}
	
			return NextResponse.json(user, { status: 201 });
		} catch (error) {
			if(error instanceof mongoose.Error.ValidationError) {
				for(let field in error.errors) {
					const msg = error.errors[field].message;
					return new NextResponse(msg, { status: 400 });
				}
			}
		}
	}
}

export { handler as POST };