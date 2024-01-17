import React from 'react';

import Meetings from './Components/Meetings';
import Generate from './Components/Generate';

import settings from './settings';

// The main App
export default class App extends React.Component{
	constructor(props) {
	  	super(props);
	  	
	  	this.state = {
	  		// need to update each time Generate button is submitted
	  		// label : itemState (with itemState.latex as a property)
	  		items: {},
	  		settings: settings,
			starting_page: '3',
			startday: 1,
			endday: 7,
			online_meetings: false,
		}

		this.setAppState = this.setAppState.bind(this);
	}

	//function for components to set App state
	setAppState(key, value) {
		this.setState({ [key]: value });		
	}

	render() {
	  	return (
		    <div className="App">
		    	<header className="App-header">
		    		<h1>Where & When Meetings Pages Generator</h1>
		    		<p className="App-subtitle">A tool to produce the meeting pages for the Where & When from The Meeting List Google Sheet.</p>
		    		<Generate state = {this.state} /> 
		    	</header>
		    	<Meetings state = {this.state} setAppState = {this.setAppState} label="meetings1" />
		    </div>
		);
	}
}

