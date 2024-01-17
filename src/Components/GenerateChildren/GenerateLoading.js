import React from 'react';

import gif from './loading.gif'; 

export default class GenerateLoading extends React.Component{
  	render() {
  		
  		// sets class for download button to hide/display if download file available
  		let download_display_class = "GenerateLoading-download-false";
  		if (this.props.state.download) {
  			download_display_class = "GenerateLoading-download-true";
  		}

  		// set file name based on type of file
  		let filename = "booklet-generator";
  		if (this.props.state.filetype === "LaTeX") {
  			filename = "booklet-generator.tex";
  		} else if (this.props.state.filetype === "Config File") {
  			filename = "booklet-generator.json";
  		}

  		if (this.props.state.loading) {
  			return (
	  			<div className="GenerateLoading-true">
	  				<img src={gif} alt="Loading..." height="128px" width="128px" />
	  			</div>
  			)
  		}
  		// need to deal with including filename extension for latex and config files
  		else {
  			return (
	  			<div className={download_display_class}>
	  				<a href={this.props.state.download} download={filename} >
		  				<button type="button" className="Generate-button btn btn-success">
		  					Download {this.props.state.filetype}
	  					</button>
  					</a>
	  			</div>
  			)
  		}
  	}
}
