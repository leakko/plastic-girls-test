import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import nodemailer, { TransportOptions } from 'nodemailer';
import { google } from 'googleapis';
import mongoose, { Connection } from 'mongoose';
import { hash } from 'bcryptjs';
import User from '@/models/user';
import { IUser } from '@/types/index';

const oAuth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_MAIL_CLIENT_ID, 
	process.env.GOOGLE_MAIL_SECRET, 
	process.env.GMAIL_REDIRECT_URI
)
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

const sendMail = async (to: string) => {
	try {
		const accessToken = await oAuth2Client.getAccessToken();
		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'plasticgirls69@gmail.com',
				clientId: process.env.GOOGLE_MAIL_CLIENT_ID,
				clientSecret: process.env.GOOGLE_MAIL_SECRET, 
				refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
				accessToken
			}
		} as TransportOptions)

		const mailOptions = {
			from: 'Plastic Girls',
			to,
			subject: 'Activate your plastic girls account',
			text: 'Test',
			html: 'Test'
		}

		return await transport.sendMail(mailOptions);

	} catch (error) {
		return error;
	}
}

const handler = async (req: Request) => {
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
		return new NextResponse('Email already in use', { status: 409 });
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
			await sendMail(email);
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