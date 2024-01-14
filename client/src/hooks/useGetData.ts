import { useEffect, useState } from 'react'

const useGetData = (url: string, auth: string | null = null) => {
	const [data, setData] = useState<any>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: auth !== null ? `Bearer ${auth}` : '',
					},
					credentials: 'include',
				})
				const data = await res.json()
				console.log(data)

				if (data) setData(data)
				else setError(data.message)
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [url, auth])

	return { data, loading, error }
}

export default useGetData
