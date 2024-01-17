import React from 'react';

import GenerateLoading from './GenerateChildren/GenerateLoading'

import generatePDF from '../Utilities/generate/generatePDF'
import generateLatex from '../Utilities/generate/generateLatex'
import generateConfig from '../Utilities/generate/generateConfig'

//import settings from '../settings';

// Generate PDF, Latex, and Config File functionality
export default class Generate extends React.Component{
	constructor(props) {
	    super(props);

	    this.state = {
	    	download: '',
	    	filetype: '',
			loading: false,
	    }

	    this.handleSubmitPDF = this.handleSubmitPDF.bind(this);
	    this.handleSubmitLatex = this.handleSubmitLatex.bind(this);
	    this.handleSubmitConfig = this.handleSubmitConfig.bind(this);
	    this.setGenerateState = this.setGenerateState.bind(this);
  	}

	//update app state source on submit
	handleSubmitPDF(event) {
		this.setState({loading: true, filetype: "PDF"});
	   	generatePDF(this.props.state, this.setGenerateState);
	    event.preventDefault();
	}

	handleSubmitLatex(event) {
    	this.setState({loading: true, filetype: "LaTeX"});
	   	generateLatex(this.props.state, this.setGenerateState);
    	//potentially use data URI to create file?
    	event.preventDefault();
  	}

   handleSubmitConfig(event) {
   		this.setState({loading: true, filetype: "Config File"});
	   	generateConfig(this.props.state, this.setGenerateState);
   		//potentially use data URI to create file?
   		event.preventDefault();
  	}

  	setGenerateState(key, value) {
		this.setState({ [key]: value });		
	}

  	render() {
	    return (
	    	<div className="Generate">
		        <form onSubmit={this.handleSubmitPDF} className="Generate-form">
		          <button type="submit" className="Generate-button btn btn-outline-primary">Generate PDF</button>
		        </form>  	
		        <GenerateLoading state={this.state} />
	    	</div>
	    );
	}
	// Submit Buttons for Late & Config
	// <form onSubmit={this.handleSubmitLatex} className="Generate-form">
	//<button type="submit" className="Generate-button btn btn-outline-secondary">Generate LaTeX</button>
	//</form>
	//<form onSubmit={this.handleSubmitConfig} className="Generate-form">
	//  <button type="submit" className="Generate-button btn btn-outline-secondary">Generate Config File</button>
	//</form>
}