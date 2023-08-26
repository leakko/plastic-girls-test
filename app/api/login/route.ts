import { connectToMongoDB } from '@/lib/mongodb';
import User from '@/models/db/user';
import { ISignInBody } from '@/models/interfaces/signin-body';
import { IUserModel } from '@/models/db/user'
import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
	try {
		await connectToMongoDB()
	} catch (error) {
		return new NextResponse(error as string, {
			status: 500
		})
	}

	let body: ISignInBody;
	try {
		body = await req.json();
	} catch(e) {
		return new NextResponse('No body provided', { status: 400 });
	}


	const { email, password } = body;

	if(!email) return new NextResponse('No email provided', { status: 400 });

	if (!password) {
		return new NextResponse('No password provided', { status: 400 });
	}
	if (password.length < 8) {
		return new NextResponse('Password must be at least 8 characters long', { status: 400 });
	}

	const user = await User.findOne({email: body.email}).lean().exec();

	if (!user) {
		return new NextResponse('Wrong email or password. Try again.', { status: 401 });
	} else {
		if(!user.active) {
			return new NextResponse('You have to validate your email to access. Check your inbox.', { status: 401 });
		}
		const isCorrectPassword = await compare(password, user.password);

		if(!isCorrectPassword) {
			return new NextResponse('Wrong email or password. Try again.', { status: 401 });
		} else {
			const { password, ...userWithoutPass } = user;
			return NextResponse.json(userWithoutPass, { status: 200 });
		}
		
	}

}