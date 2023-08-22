'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

export default function SignUp() {
	const [ submitError, setSubmitError ] = React.useState<string | null>(null);
	const [ loading, setLoading ] = React.useState<boolean>(false);
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		try {
			setLoading(true);
			const apiResponse = await fetch('/api/auth/signup', { 
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: data.get('email'),
					password: data.get('password'),
				})
			});

			if(apiResponse.ok) {
				setSubmitError(null);
				router.push('/');
			} else {
				const responseText = await apiResponse.text()
				setSubmitError(responseText);
			}
		} catch(error) {
			setSubmitError((error as Error).message);
		}
		setLoading(false);
	};

	return (
	<Container component="main" maxWidth="xs">
	<Box
		sx={{
		marginTop: 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		}}
	>
		<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
		<LockOutlinedIcon />
		</Avatar>
		<Typography component="h1" variant="h5">
		Sign Up
		</Typography>
		<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
		<TextField
			margin="normal"
			required
			fullWidth
			id="email"
			label="Email Address"
			name="email"
			autoComplete="email"
			InputLabelProps={{ shrink: true }}
			disabled={loading}
		/>
		<TextField
			margin="normal"
			required
			fullWidth
			name="password"
			label="Password"
			type="password"
			id="password"
			autoComplete="current-password"
			InputLabelProps={{ shrink: true }}
			disabled={loading}
		/>
		{ submitError && <Alert severity="error">{ submitError }</Alert> }
		<Button
			type="submit"
			fullWidth
			variant="contained"
			sx={{ mt: 3, mb: 2 }}
		>
			Sign Up
		</Button>
		<Grid container>
			<Grid item>
			<Link href="#" variant="body2">
				{"Already have an account? Sign In"}
			</Link>
			</Grid>
		</Grid>
		</Box>
	</Box>
	</Container>
	);
}