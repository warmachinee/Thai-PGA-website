import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl, fetchPostUrl } from '../../data/api'

import FieldDialog from '../Dialog/FieldDialog'

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

import lightBlue from "@material-ui/core/colors/lightBlue";
import blue from '@material-ui/core/colors/blue';

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: blue.A700,
      },
    },
    MuiPickersDay: {
      isSelected: {
        backgroundColor: blue.A700,
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: blue[900],
      },
    },
  },
});

function handleConvertDate(date){
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
  return (
    date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate())
  )
}

const createMatchCardStyles = theme =>({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    maxWidth: 700,
    margin: 'auto'
  },
  textField: {
    marginBottom: theme.spacing.unit * 2,
    minWidth: 200,
    width: '100%',
    margin: 'auto'
  },
  classnumber: {
    marginRight: theme.spacing.unit * 2
  },
  datePicker: {
    marginRight: theme.spacing.unit * 2
  },
  buttonGrid: {
    width: '100%'
  },
  button: {
    height: 56,
    textTransform: 'none'
  },
  confirm: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    height: 56,
    color: theme.palette.getContrastText(blue['A700']),
    backgroundColor: blue['A700'],
    '&:hover': {
      backgroundColor: blue[900],
    },
  }
})


const CreateMatchCard = withStyles(createMatchCardStyles)(
  class extends React.Component<Props> {
    state = {
      fieldDialogState: false,
      expanded: false,
      selectedDate: new Date(),
      selectedField: null,
      selectedMatchname: null,
      selectedClassnum: null,
    };

    handleExpand = () =>{
      this.setState( prev =>{
        return { expanded: !prev.expanded }
      })
    }
    handleFieldDialog = () => {
     this.setState({ fieldDialogState: true });
    };
    handleFieldDialogClose = () => {
     this.setState({ fieldDialogState: false });
    };

    getMatchName = (e) =>{
      this.setState({ selectedMatchname: e.target.value })
    }
    getClassnum = (e) =>{
      this.setState({ selectedClassnum: parseInt(e.target.value) })
    }
    getDate = (date) =>{
      this.setState({ selectedDate: date })
    }

    async handleCreateMatch(){
      const data = await fetchPostUrl('https://tofftime.com/api/matchcreate',{
        userid: parseInt(this.props.adminData.id),
        fieldid: this.state.selectedField.fieldid,
        matchname: this.state.selectedMatchname,
        classnum: this.state.selectedClassnum,
        date: handleConvertDate(this.state.selectedDate),
      })
      if(data.status === 'success'){
        this.setState({
          selectedDate: new Date(),
          selectedField: null,
          selectedMatchname: null,
          selectedClassnum: null,
          expanded: false
        })
        this.props.afterCreateMatch()
      }else{
        this.props.handleSnackBar(true,data.status,'error')
      }
    }

    handleConfirm = () =>{
      this.handleCreateMatch()
    }

    handleRefresh = () =>{
      this.setState(this.state)
    }
    componentDidMount(){
      window.addEventListener('resize', this.handleRefresh)
    }
    componentWillUnmount(){
      window.removeEventListener('resize', this.handleRefresh)
    }

    render() {
      const { classes, adminData } = this.props
      const {
        expanded, selectedDate, selectedMatchname, selectedClassnum,
        fieldDialogState, fieldData, selectedField
      } = this.state;
      return (
        <ExpansionPanel
          expanded={expanded}
          onChange={this.handleExpand}
          className={classes.root}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ paddingLeft: 16}}>
            <Typography variant="h6">Create Match</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ flexDirection: 'column', paddingTop: 32 }}>
            <div style={{ display: 'flex', flexDirection: (window.innerWidth > 500)?'row':'column' }}>
              <TextField
                className={classes.textField}
                label="Match name"
                margin="normal"
                variant="outlined"
                value={selectedMatchname}
                onChange={this.getMatchName}/>
              <div className={classes.buttonGrid}>
                <Button
                  style={{ marginLeft: (window.innerWidth > 500)? 16:0 }}
                  className={classes.button}
                  onClick={this.handleFieldDialog}
                  color="primary">{selectedField ? selectedField.fieldname:'Select Field'}</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: (window.innerWidth > 500)?'row':'column' }}>
              <TextField
                style={{ width: (window.innerWidth > 500)? 150:'100%'}}
                className={classes.classnumber}
                label="Class number"
                type="number"
                margin="normal"
                variant="outlined"
                value={selectedClassnum}
                onChange={this.getClassnum}/>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <MuiThemeProvider theme={materialTheme}>
                  <DatePicker
                    style={{ width: (window.innerWidth > 500)? 200:'100%'}}
                    className={classes.datePicker}
                    keyboard
                    margin="normal"
                    variant="outlined"
                    label="Date picker"
                    value={selectedDate}
                    onChange={this.getDate}/>
                </MuiThemeProvider>
              </MuiPickersUtilsProvider>
              {fieldDialogState ?
                <FieldDialog
                  adminData={adminData}
                  modalState={fieldDialogState}
                  close={this.handleFieldDialogClose}
                  getField={(field)=>this.setState({ selectedField: field })}
                  fieldData={fieldData} />:null
              }
            </div>
            <Button
              variant="contained"
              className={classes.confirm}
              onClick={this.handleConfirm}
              color="primary">Confirm</Button>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    }
  }
);

export default CreateMatchCard
