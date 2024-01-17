//creates a JSON file of the state of the App
export default function generateConfig(appState, setGenerateState){
	let config = JSON.stringify(appState);

	console.log(config);
	setGenerateState("download", config);
	setGenerateState("loading", false);
}