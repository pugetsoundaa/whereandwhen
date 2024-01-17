import generateLatexString from './generateLatexString';

//uses TexLive.js to generate a PDF of the latex produced in the App
export default function generatePDF(appState, setGenerateState){
	// generate required opening latex
	// add additional latex from app state

	let pdftex = new window.PDFTeX();

	let latexString = generateLatexString(appState);

	pdftex.compile(latexString)
		.then(function(pdf) {
			setGenerateState("download", pdf);
			setGenerateState("loading", false);
		}
	);
}