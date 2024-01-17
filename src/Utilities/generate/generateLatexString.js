//creates the latex string to be used in generatePDF and generateLatex
export default function generateLatexString(appState){
	//preamble
	let latexString = "\\documentclass[10pt]{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage[english]{babel}\n\\usepackage{calc}\n";
	// header and footer
	latexString = latexString + "\\usepackage{fancyhdr}\n\\cfoot{\\thepage}\n";
	// sets the font
	latexString = latexString + "\\renewcommand{\\familydefault}{\\sfdefault}\n";
	// page layout
	//bottom=.7in is standard but have to change to .65in for saturday inperson for some reason???
	latexString = latexString + "\\usepackage[left=.38in,right=.38in,top=.6in,bottom=.7in,headsep=.001in,papersize={3.5in,5.75in}]{geometry}\n";
	// other formatting
	latexString = latexString + "\\pagestyle{fancy}\n\\setcounter{page}{"+appState.starting_page+"}\n\\setlength\\parindent{0pt}\n\\linespread{0.6}\\begin{document}\n\\newlength{\\extSpace}\n";

	// loops through all items and adds their latex
	Object.keys(appState.items).forEach(function (item) {
		latexString += appState.items[item].latex;
	});

	// end of document
	latexString = latexString +  "\\end{document}";

	return latexString;
}