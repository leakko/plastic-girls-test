export default function Page({ params }: { params: { userId: string } }) {
	return (
	  <main>
		<h1>Activating {params.userId}</h1>
	  </main>
	)
  }
  