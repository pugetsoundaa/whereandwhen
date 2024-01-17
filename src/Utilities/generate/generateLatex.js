import generateLatexString from './generateLatexString';

//creates a latex file of the latex produced in the App
export default function generateLatex(appState, setGenerateState){
	let latexfile = generateLatexString(appState);

	setGenerateState("download", latexfile);
	setGenerateState("loading", false);
}