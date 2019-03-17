import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl, fetchPostUrl } from '../../data/api'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import SnackBarAlert from '../SnackBarAlert'

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import CloseIcon from '@material-ui/icons/Close';

import blue from '@material-ui/core/colors/blue';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  dialog: {
    ...theme.mixins.gutters(),
    top: '50%',
    left: '50%',
    overflow: 'auto',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    outline: 'none',
    maxWidth: 600,
    width: '100%',
    minWidth: 300,
    maxHeight: window.innerHeight
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
    top: theme.spacing.unit * 2,
    color: theme.palette.grey[500],
  },
  cancelButton: {
    margin: theme.spacing.unit * 2,
    height: 48,
    width: '100%',
  },
  deleteButton: {
    margin: theme.spacing.unit * 2,
    height: 48,
    width: '100%',
  }
});

class MatchEditorDialog extends React.Component {
  state = {
    fieldname: null,
    fieldScore: [],
    snackBarState: false,
    snackBarMessage: null,
    snackBarVariant: null
  }
  handleClose = () =>{
    this.fetchLoadMatch()
    this.props.close()
  }
  handleDelete = () =>{
    this.fetchDeleteMatch()
  }
  async fetchDeleteMatch(){
    const data = await fetchPostUrl('https://thai-pga.com/api/matchdelete',{
      userid: parseInt(this.props.adminData.id),
      matchid: this.props.matchEditorData.matchid,
    })
    if(data.status === 'delete'){
      this.handleClose()
      this.props.afterDeleteMatch()
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: data.status,
        snackBarVariant: 'error'
      })
    }
  }
  async fetchLoadMatch(){
    const match = await fetchUrl('https://thai-pga.com/api/loadmatch')
    let tempData = []
    for(var i = 0;i < match.matchid.length;i++){
      tempData.push({
        i: i,
        matchid: match.matchid[i],
        matchname: match.matchname[i],
        date: match.date[i],
        fieldname: match.fieldname[i],
        display: match.display[i]
      })
    }
    this.props.afterEditor(tempData)
  }
  render() {
    const { classes, close, modalState, matchEditorData  } = this.props;
    const { fieldScore, snackBarState, snackBarMessage, snackBarVariant} = this.state
    const deleteMatchState = (matchEditorData.type === 'Delete match')? true : false;
    return (
      <Modal
        open={modalState}
        onClose={this.handleClose}
      >
        <div className={classes.dialog}>
          <div className={classes.dialogTitle}>
            <Typography variant="h6">{ deleteMatchState ?'Are you sure you want to delete?':matchEditorData.type}</Typography>
            {modalState ? (
              <IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleClose}>
                <CloseIcon fontSize="large"/>
              </IconButton>
            ) : null}
          </div>
          <Divider variant="middle" />
          { !deleteMatchState ?
            <div>
              Edit match
              <SnackBarAlert
                variant={snackBarVariant}
                autoHideDuration={2000}
                open={snackBarState}
                onClose={()=>this.setState({ snackBarState: false })}
                message={snackBarMessage}/>
            </div>:
            <div style={{ display: 'flex', marginTop: 48 }}>
              <Button
                className={classes.cancelButton}
                onClick={close}>Cacel</Button>
              <Button
                color="secondary"
                variant="contained"
                className={classes.deleteButton}
                onClick={this.handleDelete}>Delete</Button>
            </div>
          }
        </div>
      </Modal>
    );
  }
}

MatchEditorDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MatchEditorDialog);
