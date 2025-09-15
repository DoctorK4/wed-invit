import axios from "axios";


const addRSVP = async (name: string, ph: string, byCar: boolean) => {
	const url = import.meta.env.VITE_APP_SCRIPT_URL;

	const res = await axios.post(url, {
			name,
			ph,
      byCar,
	}, {
		headers: {
			"Content-Type" : "application/x-www-form-urlencoded",
		}
	})
	console.log(res);
}

export { addRSVP }