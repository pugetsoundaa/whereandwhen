import React from 'react';

import meetingsProcess from '../Utilities/meetings/meetingsProcess';

// Component for loading a source of Meetings and selecting its print settings
export default class Meetings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      latex: "",
      load_message: 'Current Settings and Source Not Loaded',
      settings: {},
      source: '13W4lBuRWKpnHNOC_3wTXI5anLVOkyvMmyn4Wvqx1z3c',
    }

    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleStartdayChange = this.handleStartdayChange.bind(this);
    this.handleEnddayChange = this.handleEnddayChange.bind(this);
    this.handleOnlineMeetingsChange = this.handleOnlineMeetingsChange.bind(this);
    this.handleSourceSubmit = this.handleSourceSubmit.bind(this);
    this.setMeetingsState = this.setMeetingsState.bind(this);
  }

  //update state when textbox input changes
  handleSourceChange(event) {
    this.setState({source: event.target.value, latex: '', load_message: 'Current Settings and Source Not Loaded'});
  }

  //processes meetings and creates latex and then updates item state with App
  handleSourceSubmit = (event) => {
    meetingsProcess(this.props.state, this.state, this.setMeetingsState, () => {
        let items = this.props.state.items;
        items[this.props.label] = this.state;
        this.props.setAppState('items', items);
      } 
    );
    event.preventDefault();
  }

  //update state when textbox input changes
  handlePageChange(event) {
    this.setState({latex: '', load_message: 'Current Settings and Source Not Loaded'});
    this.props.setAppState('starting_page', event.target.value);
  }

  //update state when textbox input changes
  handleStartdayChange(event) {
    this.setState({latex: '', load_message: 'Current Settings and Source Not Loaded'});
    this.props.setAppState('startday', event.target.value);
  }

  //update state when textbox input changes
  handleEnddayChange(event) {
    this.setState({latex: '', load_message: 'Current Settings and Source Not Loaded'});
    this.props.setAppState('endday', event.target.value);
  }

  //update state when textbox input changes
  handleOnlineMeetingsChange(event) {
    this.setState({latex: '', load_message: 'Current Settings and Source Not Loaded'});
    this.props.setAppState('online_meetings', event.target.value);
  }

  //function for components to set Meetings state
  setMeetingsState(key, value) {
    this.setState({ [key]: value });    
  }

  render() {

    // sets load_message_class depending on state of Meetings
    let load_message_class = "Meetings-button btn btn-warning";
    if (this.state.errors.length) {
      load_message_class = "Meetings-button btn btn-danger";
    } else if (this.state.latex) {
      load_message_class = "Meetings-button btn btn-success";
    }
    
    return (
      <div className="Meetings">
        <h2>Add Meetings</h2>
        <h3>Settings:</h3>
        
        <form className="App-content" id={this.props.label} onSubmit={this.handleSourceSubmit}>
          <label className="Meetings-source-lable">Enter Google Sheet ID:&nbsp;</label>
          <input className="Meetings-source-input" type="text" value={this.state.source} onChange={this.handleSourceChange} />
          
          <br></br>

          <label className="Meetings-page-lable">Enter Starting Page #:&nbsp;</label>
          <input className="Meetings-page-input" type="text" value={this.props.state.starting_page} onChange={this.handlePageChange} />

          <br></br>

          <label className="Meetings-startday-lable">Enter Starting Day #:&nbsp;</label>
          <input className="Meetings-startday-input" type="text" value={this.props.state.startday} onChange={this.handleStartdayChange} />

          <br></br>

          <label className="Meetings-endday-lable">Enter Ending Day #:&nbsp;</label>
          <input className="Meetings-endday-input" type="text" value={this.props.state.endday} onChange={this.handleEnddayChange} />
          
          <br></br>
          <label className="Meetings-onlinemeetings-lable">Enter Online Meeting Boolean:&nbsp;</label>
          <input className="Meetings-onlinemeetings-input" type="text" value={this.props.state.online_meetings} onChange={this.handleOnlineMeetingsChange} />
        </form>

        <h3>Load Settings:</h3>
        <div className="App-content">
          <button type="submit" className="Meetings-button btn btn-primary" form={this.props.label}>Load</button>
          <button type="button" className={load_message_class} disabled>{this.state.load_message}</button>
          <p className="App-note">*Any change to the settings requires reloading</p>
        </div>
        <h3 className={this.state.errors.length ? 'App-error' : 'App-error-hidden'}>Error Message:</h3>
      </div>
    );
  }
}