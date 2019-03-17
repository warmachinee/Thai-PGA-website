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

const inputTheme = createMuiTheme({
  overrides: {
    MuiInputBase: {
      input: {
        fontSize: 12
      },
    },
  },
  typography: { useNextVariants: true },
});

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
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit
  },
  title: {
    margin: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
    top: theme.spacing.unit * 2,
    color: theme.palette.grey[500],
  },
  fieldname: {
    margin: theme.spacing.unit * 2,
  },
  score: {
    margin: theme.spacing.unit * 2,
  },
  scoreTextFieldItem: {
    width: 52,
  },
  saveButton: {
    marginTop: theme.spacing.unit * 2,
    height: 48,
    width: '100%',
    color: theme.palette.getContrastText(blue['A700']),
    backgroundColor: blue['A700'],
    '&:hover': {
      backgroundColor: blue[900],
    },
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

class FieldEditorDialog extends React.Component {
  state = {
    fieldname: null,
    fieldScore: [],
    snackBarState: false,
    snackBarMessage: null,
    snackBarVariant: null
  }
  handleClose = () =>{
    this.fetchLoadField()
    this.props.close()
  }
  handleSave = () =>{
    let fieldEditData = this.props.fieldEditData
    if(fieldEditData){
      if(fieldEditData.type === 'Edit field'){
        this.fetchEditField()
      }else{
        this.fetchCreateField()
      }
    }
  }
  handleDelete = () =>{
    this.fetchDeleteField()
  }
  handleScoreChange = (score,index) =>{
    this.state.fieldScore[index] = parseInt(score)
  }
  async fetchDeleteField(){
    const data = await fetchPostUrl('https://thai-pga.com/api/customfielddelete',{
      userid: parseInt(this.props.adminData.id),
      fieldid: this.props.fieldEditData.fieldid,
    })
    if(data.status === 'delete success'){
      this.handleClose()
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: data.status,
        snackBarVariant: 'error'
      })
    }
  }
  async fetchEditField(){
    const data = await fetchPostUrl('https://thai-pga.com/api/customfieldedit',{
      userid: parseInt(this.props.adminData.id),
      fieldid: this.props.fieldEditData.fieldid,
      fieldname: this.state.fieldname,
      score: this.state.fieldScore
    })
    if(data.status === 'update success'){
      this.handleClose()
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: data.status,
        snackBarVariant: 'error'
      })
    }
  }
  async fetchCreateField(){
    const data = await fetchPostUrl('https://thai-pga.com/api/customfieldcreate',{
      userid: parseInt(this.props.adminData.id),
      fieldname: this.state.fieldname,
      score: this.state.fieldScore
    })
    console.log(data);
    if( data.status === 'field success'){
      this.handleClose()
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: data.status,
        snackBarVariant: 'error'
      })
    }
  }
  async fetchLoadField(){
    const field = await fetchUrl('https://thai-pga.com/api/loadfield')
    let tempData = []
    for(var i = 0;i < field.fieldid.length;i++){
      tempData.push({
        fieldid: field.fieldid[i],
        fieldname: field.fieldname[i]
      })
    }
    this.props.afterCreateField(tempData)
  }
  handleRefresh = () =>{
    this.setState(this.state)
  }
  componentDidMount(){
    window.addEventListener('resize',this.handleRefresh)
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.handleRefresh)
  }
  render() {
    const { classes, close, modalState, fieldEditData  } = this.props;
    const { fieldScore, snackBarState, snackBarMessage, snackBarVariant } = this.state
    const deleteFieldState = (fieldEditData.type === 'Delete field')? true : false;
    return (
      <Modal
        open={modalState}
        onClose={close}
      >
        <div className={classes.dialog} style={{ maxHeight: window.innerHeight }}>
          <div className={classes.dialogTitle}>
            <Typography variant="h6">{ deleteFieldState ?'Are you sure you want to delete?':fieldEditData.type}</Typography>
            {modalState ? (
              <IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleClose}>
                <CloseIcon fontSize="large"/>
              </IconButton>
            ) : null}
          </div>
          <Divider variant="middle" />

          { !deleteFieldState?
            <React.Fragment>
              <div className={classes.fieldname}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Fieldname"
                  onChange={(e)=>this.setState({ fieldname: e.target.value })}
                />
              </div>

              <Typography className={classes.title} variant="h6">Hole Score</Typography>
              <Divider variant="middle" />
              <div className={classes.score}>
                <div style={{ display: 'flex', overflow: 'auto' }}>
                  {[0,1,2,3,4,5,6,7,8].map( index =>
                    <div style={{ margin: 'auto' }}>
                      <MuiThemeProvider theme={inputTheme}>
                        <TextField
                          key={index}
                          className={classes.scoreTextFieldItem}
                          label={(index + 1) < 10? "0" + (index + 1) : index + 1 }
                          margin="normal"
                          variant="outlined"
                          onChange={(e)=>this.handleScoreChange(e.target.value,index)}/>
                      </MuiThemeProvider>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', overflow: 'auto' }}>
                  {[9,10,11,12,13,14,15,16,17].map( index =>
                    <div style={{ margin: 'auto' }}>
                      <MuiThemeProvider theme={inputTheme}>
                        <TextField
                          key={index}
                          className={classes.scoreTextFieldItem}
                          label={index + 1}
                          margin="normal"
                          variant="outlined"
                          onChange={(e)=>this.handleScoreChange(e.target.value,index)}/>
                      </MuiThemeProvider>
                    </div>
                  )}
                </div>
              </div>

              <Typography className={classes.title} variant="h6">HCP Score</Typography>
              <Divider variant="middle" />
              <div className={classes.score}>
                <div style={{ display: 'flex', overflow: 'auto' }}>
                  {[0,1,2,3,4,5,6,7,8].map( index =>
                    <div style={{ margin: 'auto' }}>
                      <MuiThemeProvider theme={inputTheme}>
                        <TextField
                          key={index}
                          className={classes.scoreTextFieldItem}
                          label={(index + 1) < 10? "0" + (index + 1) : index + 1 }
                          margin="normal"
                          variant="outlined"
                          onChange={(e)=>this.handleScoreChange(e.target.value,index + 18)}/>
                      </MuiThemeProvider>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', overflow: 'auto' }}>
                  {[9,10,11,12,13,14,15,16,17].map( index =>
                    <div style={{ margin: 'auto' }}>
                      <MuiThemeProvider theme={inputTheme}>
                        <TextField
                          key={index}
                          className={classes.scoreTextFieldItem}
                          label={index + 1}
                          margin="normal"
                          variant="outlined"
                          onChange={(e)=>this.handleScoreChange(e.target.value,index + 18)}/>
                      </MuiThemeProvider>
                    </div>
                  )}
                </div>
              </div>

              <Button
                color="primary"
                variant="contained"
                className={classes.saveButton}
                onClick={this.handleSave}>Save</Button>
              <SnackBarAlert
                variant={snackBarVariant}
                autoHideDuration={2000}
                open={snackBarState}
                onClose={()=>this.setState({ snackBarState: false })}
                message={snackBarMessage}/>
            </React.Fragment>:
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

FieldEditorDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FieldEditorDialog);
