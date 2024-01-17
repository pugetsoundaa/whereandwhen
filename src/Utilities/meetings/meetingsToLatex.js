// takes processed meetings JSON and converts to a LaTex string
export default function meetingsToLatex(appState, meetingsState, setMeetingsState, callback, meetings, errors) {
	
	let print_strings = appState.settings.print_strings[appState.settings.language];
	let latex = '';
	let meetingsByDay = [];

	let online = appState.online_meetings;
	let meetingCount = 0;

	// sorts meeting by day
	for (let i=0; i < 7; i++) {
		meetingsByDay[i] = [];
		for (let j=0; j < meetings.length; j++) {
  			if (meetings[j].day === i.toString()) {
				// for 5/11/21 printing to filter In Person vs Online
				if(!online && !meetings[j].types.includes('TC') && meetings[j].address){
					// removes english and online related codes
					meetings[j].types = meetings[j].types.replace(',EN', '');
					meetings[j].types = meetings[j].types.replace('EN,', '');
					meetings[j].types = meetings[j].types.replace(',TC', '');
					meetings[j].types = meetings[j].types.replace('TC,', '');
					meetings[j].types = meetings[j].types.replace(',ONL', '');
					meetings[j].types = meetings[j].types.replace('ONL,', '');
					meetings[j].types = meetings[j].types.replace(',NL', '');
					meetings[j].types = meetings[j].types.replace('NL,', '');
					meetingsByDay[i].push(meetings[j]);
					meetingCount++;
				}
				else if(online && meetings[j].types.includes('ONL'))
				{
					meetings[j].types = meetings[j].types.replace(',EN', '');
					meetings[j].types = meetings[j].types.replace('EN,', '');
					meetings[j].types = meetings[j].types.replace(',TC', '');
					meetings[j].types = meetings[j].types.replace('TC,', '');
					meetings[j].types = meetings[j].types.replace(',ONL', '');
					meetings[j].types = meetings[j].types.replace('ONL,', '');
					meetings[j].types = meetings[j].types.replace(',NL', '');
					meetings[j].types = meetings[j].types.replace('NL,', '');
					meetingsByDay[i].push(meetings[j]);
					meetingCount++;
				}
				// meetingsByDay[i].push(meetings[j]);
			}
		}
	}
	console.log(meetingCount);

	// loops through and creates latex for each meeting organized by day
	for (let i=(appState.startday - 1); i<=(appState.endday - 1); i++) {
		// for 5/11/21 printing to display In Person vs Online
		if(!online){
			latex += "\\chead{In Person "+ print_strings[appState.settings.days[i]] + " Meetings}\n"
		}
		else if(online)
		{
			latex += "\\chead{Online "+ print_strings[appState.settings.days[i]] + " Meetings}\n"
		}
		//latex += "\\chead{"+ print_strings[appState.settings.days[i]] + " Meetings}\n"
		//need to do latex for day heading
		for (let j=0; j<meetingsByDay[i].length; j++) {
			latex += "{\\footnotesize " + singleMeetingToLatex(meetingsByDay[i][j], print_strings, online) + "}\n";
			if (j !== meetingsByDay[i].length -1) {
				latex += "\\medskip \\\\ \n"
			}
		}
		latex = latex + "\\newpage\n";
	}

	//updates Meeting state 
	setMeetingsState('errors', errors);
	setMeetingsState('load_message', errors.length ? "Error Loading" : "Loaded Successfully");
	setMeetingsState('latex', latex);
	callback();
}

function singleMeetingToLatex(meeting, print_strings, online){
	// let newname = latexEscapeCharacterFilter(meeting.name);
	let newname = latexEscapeCharacterFilter(((typeof meeting.wwname === 'undefined') || (meeting.wwname === '')) ? meeting.name : meeting.wwname);
	let newaddress = latexEscapeCharacterFilter(meeting.address);
	// let newnotes = latexEscapeCharacterFilter(meeting.notes);
	
	// for 5/11/21, sets newnotes to wwonlinenotes for online meetings
	let newnotes;
	if(!online){
		newnotes = latexEscapeCharacterFilter(((typeof meeting.wwnotes === 'undefined') || (meeting.wwnotes === '')) ? meeting.location : meeting.wwnotes);
		
		if (newnotes !== '') {
			newnotes = ", " + newnotes;
		}
	}
	else if(online)
	{
		newnotes = latexEscapeCharacterFilter((typeof meeting.wwonlinenotes === 'undefined') ? '' : meeting.wwonlinenotes);
	}

	/*let newnotes = latexEscapeCharacterFilter(meeting.wwnotes);
	if (newnotes !== '') {
		newnotes = ", " + newnotes;
	}*/
	let newtime = formatTime(meeting.time, print_strings);

	//need to format time
	let latex = "\\settowidth{\\extSpace}{" + newtime + "} \\setlength{\\extSpace}{4.2em - \\extSpace} ";
		latex = latex + newtime + " \\hspace{\\extSpace} \\textbf{"+newname+"} \\hfill "+meeting.city+"\n";
		latex = latex + "\\settowidth{\\extSpace}{" + meeting.types + "} \\setlength{\\extSpace}{4.2em - \\extSpace} ";
		//latex = latex + "\\\\ " + meeting.types + " \\hspace{\\extSpace} " + newaddress + newnotes;

		
		// for 5/11/21, removes address is online
		if(!online){
			latex = latex + "\\\\ " + meeting.types + " \\hspace{\\extSpace} " + newaddress + newnotes;
		}
		else if(online)
		{
			latex = latex + "\\\\ " + meeting.types + " \\hspace{\\extSpace} " + newnotes;
		}

	return latex;
}

function latexEscapeCharacterFilter(preString){
	let postString = preString.replace(/&/g, "\\&");
	// right now only a need for &
	//postString = postString.replace(/%/g, "\\%");
	// $ is doing something weird so definitely leave it out until issue figured out
	//postString = postString.replace(/$/g, "\\$");
	postString = postString.replace(/#/g, "\\#");
	//postString = postString.replace(/_/g, "\\_");
	//postString = postString.replace(/\{/g, "\\\{");
	//postString = postString.replace(/\}/g, "\\\}");
	return postString;
}

function formatTime(time, print_strings) {

	//check that string is HH:MM
	if (!time || time.length !== 5 || time.substr(2, 1) !== ':') return null;

	//get hours and minutes
	const [ hours, minutes ] = time.split(':');

	//check for times with special names
	if (hours === '12' && minutes === '00') {
		return print_strings.noon;
	} else if (
		(hours === '00' && minutes === '00') || 
		(hours === '23' && minutes === '59') || 
		(hours === '24' && minutes === '00')
	) {
		return print_strings.midnight;
	}

	//create a date object
	let date = new Date();
	date.setHours(parseInt(hours));
	date.setMinutes(parseInt(minutes));
	return date.toLocaleTimeString([], {
		hour: 'numeric',
		minute:'2-digit'
	});
}