import axios from "axios";
import "./App.css";

function App() {
	const handleSignIn = async () => {
		console.log("sign in");
		const serverUrl = import.meta.env.VITE_SERVER_URL;
		const { data } = await axios.get(`${serverUrl}/api/auth/google/init`);
		console.log(data);
		if (data.value) {
			window.location.href = data.value;
		}
	};
	const handleSignOut = async () => {
		console.log("sign out");
	};
	return (
		<div>
			<div></div>
			<div>
				<button onClick={handleSignIn}>sign in with google</button>
				<button onClick={handleSignOut}>sign out</button>
			</div>
		</div>
	);
}

export default App;
