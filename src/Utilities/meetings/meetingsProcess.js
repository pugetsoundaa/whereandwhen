import meetingsToLatex from './meetingsToLatex';
import meetingsProcessGoogleSheet from './meetingsProcessGoogleSheet';

// pocesses JSON from file, feed, or Google Sheet according to Meeting Guide spec
export default function meetingsProcess(appState, meetingsState, setMeetingsState, callback) {
		
		let errors = meetingsState.errors;
		if(meetingsState.source) {
			let source_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+meetingsState.source+'/values/A1:ZZ?key=AIzaSyAdMoeqxk-EWspUIJDwN7GBSwWSzgL6E5A'
			fetch(source_url).then(result => { return result.json(); }).then(result => {
				//for readability
				let meetings = result;

				//if Google Sheet, translate to Meeting Guide spec JSON
				//if (meetingsState.source.includes('sheets.googleapis.com')) {
				//	meetings = meetingsProcessGoogleSheet(meetings);
				//}

				//Currently this is only for Google Sheets so commented out above If statement
				meetings = meetingsProcessGoogleSheet(meetings);

				//check for any meetings with arrays of days and creates an individual meeting for each day in array
				let meetings_to_add = [];
				let indexes_to_remove =[];

				for (let i=0; i < meetings.length; i++) {
					
					//for readability
					let meeting = meetings[i]; 

					if (Array.isArray(meeting.day)) {
						indexes_to_remove.push(i);
						meeting.day.forEach(function(single_day) {
							let temp_meeting = Object.assign({}, meeting);
							temp_meeting.day = single_day;
							temp_meeting.slug = meeting.slug + "-" + single_day;
							meetings_to_add.push(temp_meeting);
						});
					}
				}

				for (let i=0; i < indexes_to_remove.length; i++) {
					meetings = meetings.splice(indexes_to_remove[i], 1);
				}

				meetings = meetings.concat(meetings_to_add);

				//lookups to be used in below loop for day and types processing
				const lookups = appState.settings.lookups[appState.settings.language];
				const lookup_day = appState.settings.days.map(day => lookups.days[day])
				const lookup_type = {};
				for (let code in lookups.types) {
					lookup_type[lookups.types[code]] = code;
				}

				//process meetings into correct format based on Meeting Guide spec
				for (let i = 0; i < meetings.length; i++) {

					//for readability
					let meeting = meetings[i];

					//format day
					if (Number.isInteger(meeting.day)) {
						//convert day to string if integer
						meeting.day = meeting.day.toString();
					} else if (lookup_day.includes(meeting.day)) {
						meeting.day = lookup_day.indexOf(meeting.day).toString();
					}

					//format types
					if (meeting.types) {
						/*meeting.types = meeting.types.map(type => type.trim()).filter(type => type.length);
						for (let j = 0; j < meeting.types.length; j++) {
							if (meeting.types[j] in lookup_type) {
								meeting.types[j] = lookup_type[meeting.types[j]];
							}
						}
						meeting.types = meeting.types.filter(type => type in lookups.types).sort();*/
					}
				}

				//TODO: deconstruct formatted_address to get city

				//????: how to deal with region

				meetingsToLatex(appState, meetingsState, setMeetingsState, callback, meetings, errors);
			});	
		}
		
  	}
			