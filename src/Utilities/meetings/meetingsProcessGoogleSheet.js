//translates Google Sheet JSON into Meeting Guide format
export default function meetingsProcessGoogleSheet(data) {
	//see Cateret County example on https://github.com/meeting-guide/spreadsheet
	//https://docs.google.com/spreadsheets/d/e/2PACX-1vQJ5OsDCKSDEvWvqM_Z6tmXe4N-VYEnEAfvU5PX5QXZjHVbnrX-aeiyhWnZp0wpWtOmWjO4L5GJtfFu/pubhtml
	//JSON: https://spreadsheets.google.com/feeds/list/1prbiXHu9JS5eREkYgBQkxlkJELRHqrKz6-_PLGPWIWk/1/public/values?alt=json
		
	let meetings = [];

	for (let i = 1; i < data.values.length; i++) {

		//creates a meeting object containing a property corresponding to each column header of the Google Sheet
		
		/*let meeting = {};
		const meetingKeys = Object.keys(data.feed.entry[i])
		for (let j= 0; j < meetingKeys.length; j++) {
			if (meetingKeys[j].substr(0,4) === 'gsx$') {
				meeting[meetingKeys[j].substr(4)] = data.feed.entry[i][meetingKeys[j]]['$t'];
			}
		}*/

		let meeting = {};

		for (let j = 0; j < data.values[0].length; j++) {
			meeting[data.values[0][j]] = data.values[i][j];
		}

		//converts time to HH:MM
		meeting.time = parseTime(meeting.time);

		//array-ifys types
		//meeting.types = meeting.types.split(',');

		//for pugetsoundaa Where & When
		meeting.types = meeting.types.replace('X', 'H');
		meeting.types = meeting.types.replace('LGBTQ', 'L');
		meeting.types = meeting.types.replace('CF', 'K');
		meeting.types = meeting.types.replace('X', 'H');
		meeting.types = meeting.types.replace('ASL', 'A');
		meeting.types = meeting.types.replace('AL-AN', '@');
		meeting.types = meeting.types.replace('SP', 'P');
		// removes whitespace
		meeting.types = meeting.types.replace(/\s/g, '');


		meetings.push(meeting);
	}
		
	return meetings;
}

function parseTime(timeString) {
	if (!timeString.length) return null;
	
	const time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);

	if (time == null) return null;
	
	let hours = parseInt(time[1], 10);	 
	if (hours === 12 && !time[4]) {
		hours = 0;
	} else {
		hours += (hours < 12 && time[4]) ? 12 : 0;
	}	

	return String(hours).padStart(2, '0') + ':' + time[3];
}