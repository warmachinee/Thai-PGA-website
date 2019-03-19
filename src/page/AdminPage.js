import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl, fetchPostUrl } from '../data/api'

import FieldDialog from '../components/Dialog/FieldDialog'
import CreateMatchCard from '../components/Card/CardCreateMatch'
import EditMatchCard from '../components/Card/CardEditMatch'
import SnackBarAlert from '../components/SnackBarAlert'

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';

import lightBlue from "@material-ui/core/colors/lightBlue";
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
  root: {
    marginTop: window.innerWidth > 600 ? 64: 56,
    marginBottom: 250
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit,
    maxWidth: 700,
    margin: 'auto'
  },
});

class AdminPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      afterCreateMatchData: 0,
      snackBarState: false,
      snackBarMessage: null,
      snackBarVariant: null
    }
  }
  handleSnackBar = ( state, message, variant ) =>{
    this.setState({
      snackBarState: state,
      snackBarMessage: message,
      snackBarVariant: variant
    })
  }
  afterCreateMatch = () =>{
    this.setState( prev =>{
      return { afterCreateMatchData: prev.afterCreateMatchData + 1 }
    })
  }

  render() {
    const { classes, theme, data } = this.props;
    const { afterCreateMatchData, snackBarState, snackBarMessage, snackBarVariant } = this.state
    return (
      <div className={classes.root}>
        <CreateMatchCard
          afterCreateMatch={this.afterCreateMatch}
          handleSnackBar={this.handleSnackBar}
          adminData={data}/>
        <EditMatchCard
          adminData={data}
          handleSnackBar={this.handleSnackBar}
          afterCreateMatchData={afterCreateMatchData}/>
        <SnackBarAlert
          variant={snackBarVariant}
          autoHideDuration={2000}
          open={snackBarState}
          onClose={()=>this.setState({ snackBarState: false })}
          message={snackBarMessage}/>
      </div>
    );
  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminPage);
