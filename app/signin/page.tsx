'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

export default function SignUp() {
	const [ alertMessage, setAlertMessage ] = React.useState<string | null>(null);
	const [ loading, setLoading ] = React.useState<boolean>(false);
	const [ alertModality, setAlertModality ] = React.useState< 'error' | 'success' >('error');
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		try {
			setLoading(true);
			const apiResponse = await fetch('/api/signin', { 
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
				setAlertMessage(null);
				router.push('/');
				
			} else {
				const responseText = await apiResponse.text()
				setAlertMessage(responseText);
				setAlertModality('error');
			}
		} catch(error) {
			setAlertMessage((error as Error).message);
			setAlertModality('error');
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
		<LoginOutlined />
		</Avatar>
		<Typography component="h1" variant="h5">
		Login
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
		{ alertMessage && <Alert sx={{ mt: 2 }} severity={alertModality}>{ alertMessage }</Alert> }
		{ loading 
		? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
				<CircularProgress />
			</Box>
		: 
		alertModality !== 'success'
		? <Box>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
				>
					LOGIN
				</Button>
				<Grid container>
				<Grid item>
				<Link href="/signup">
					{"Don't you have an account? Register"}
				</Link>
				</Grid>
			</Grid>
			</Box>
		: null
		}
		</Box>
	</Box>
	</Container>
	);
}