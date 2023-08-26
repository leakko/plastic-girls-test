'use client'

import React from 'react';
import { SessionProvider } from 'next-auth/react'

interface Props {
	children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: any) => {
	return (
		<SessionProvider>
			{ children }
		</SessionProvider>
	)
}