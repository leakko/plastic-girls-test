import { connectToMongoDB } from '@/lib/mongodb';
import User from '@/models/db/user';
import { IUser } from '@/types';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link'

export default async function Page({ params }: { params: { userId: string } }) {

	const { userId } = params;
	let error: boolean = false;
	let user: IUser | null = null;

	try {
		await connectToMongoDB()
	} catch (e) {
		error = true;
	}

	try {
		user = await User.findByIdAndUpdate(userId, { active: true }).exec();
	} catch (e) {
		error = true;
	}

	return (
	  <main>
		<Container component="main" maxWidth="xs">
			{ 
			error 
			?  <h3>There was an error validating your email. Try again later 😞</h3>
			: <div>
					<h1>Congratulations!</h1>
					<h3>You have activated your account ({user?.email}) ✅</h3>

					<Link href="/signin">
						<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
						>
								Go to login
						</Button>
					</Link>
				</div>
			}
		</Container>
	  </main>
	)
  }
  