'use client';

import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { NextAppDirEmotionCacheProvider } from './EmotionCache';
import CssBaseline from '@mui/material/CssBaseline';

const themeOptions: ThemeOptions = {};

const theme = createTheme(themeOptions);

export default function ThemeRegistry({children}: { children: React.ReactNode }) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</NextAppDirEmotionCacheProvider>
	);
}