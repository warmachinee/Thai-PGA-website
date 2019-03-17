import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl, fetchPostUrl } from '../../data/api'

import FieldEditorDialog from './FieldEditorDialog'

import Typography from '@material-ui/core/Typography';
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import blue from '@material-ui/core/colors/blue';

const fieldDialogStyles = theme => ({
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
    maxWidth: 500,
    width: '100%',
    minWidth: 300,
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
    top: theme.spacing.unit * 2,
    color: theme.palette.grey[500],
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit
  },
  searchBox: {
    margin: theme.spacing.unit * 2,
  },
  dialogContent: {
    margin: theme.spacing.unit * 2,
    boxSizing: 'border-box',
  },
  saveButton: {
    marginTop: theme.spacing.unit,
    height: 48,
    width: '100%',
    color: theme.palette.getContrastText(blue['A700']),
    backgroundColor: blue['A700'],
    '&:hover': {
      backgroundColor: blue[900],
    },
  },
  loadmoreButton: {
    height: 48,
    width: '100%',
  },
  controlButton: {
    margin: theme.spacing.unit * 2,
    marginRight: 0,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  controlLeftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class FieldDialog extends React.Component {
  state = {
    createFieldModalState: false,
    fieldData: null,
    fieldSelected: null,
    searchData: '',
    fieldEditData: {
      type: null,
      fieldid: null,
      fieldname: null,
      score: null,
      HCscore: null
    },
    editState: false,
    deleteState: false,
    visible: 10,
  }
  handleSelect = (d) =>{
    this.setState({ fieldSelected: d })
  }
  handleSave = () =>{
    this.props.getField(this.state.fieldSelected)
    this.props.close()
  }
  toggleEdit = () =>{
    this.setState( prev =>{
      return {
        editState: !prev.editState ,
        deleteState: false
      }
    })
  }
  toggleDelete = () =>{
    this.setState( prev =>{
      return {
        editState: false,
        deleteState: !prev.deleteState
      }
    })
  }
  handleFieldCreate = () =>{
    this.setState({ fieldEditData: {
      type:'Create field'
    }})
    this.handleFieldEditorModal()
  }
  handleFieldEdit = (d) =>{
    this.setState({ fieldEditData: {
      type:'Edit field',
      fieldid: d.fieldid,
      fieldname: d.fieldname,
      score: d.score,
      HCscore: d.HCscore
    }})
    this.handleFieldEditorModal()
  }
  handleFieldDelete = (d) =>{
    this.setState({ fieldEditData: {
      type:'Delete field',
      fieldid: d.fieldid,
      fieldname: d.fieldname,
      score: d.score,
      HCscore: d.HCscore
    }})
    this.handleFieldEditorModal()
  }
  handleFieldEditorModal = () =>{
    this.setState({ createFieldModalState: true })
  }
  handleFieldEditorModalClose = () =>{
    this.setState({ createFieldModalState: false })
  }
  handleLoadmore = () =>{
    this.setState( prev =>{
      return { visible: prev.visible + 10}
    })
  }

  async fetchLoadField(){
    const field = await fetchUrl('https://thai-pga.com/api/loadfield')
    let tempData = []
    for(var i = 0;i < field.fieldid.length;i++){
      tempData.push({
        fieldid: field.fieldid[i],
        fieldname: field.fieldname[i],
        score: field.score[i],
        HCscore: field.HCscore[i]
      })
    }
    this.setState({ fieldData: tempData })
  }

  handleRefresh = () =>{
    this.setState(this.state)
  }
  afterCreateField = (data) =>{
    this.setState({ fieldData: data })
  }
  componentDidMount(){
    this.fetchLoadField()
    window.addEventListener('resize',this.handleRefresh)
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.handleRefresh)
  }
  render() {
    const { classes, adminData, close, modalState } = this.props
    const {
      visible,
      fieldSelected, fieldData, searchData, createFieldModalState,
      editState, deleteState, fieldEditData, tempDDD
    } = this.state
    return (
      <Modal
        open={modalState}
        onClose={close}>
        <div className={classes.dialog} style={{ maxHeight: window.innerHeight }}>
          <FieldEditorDialog
            fieldEditData={fieldEditData}
            adminData={adminData}
            afterCreateField={this.afterCreateField}
            modalState={createFieldModalState}
            close={this.handleFieldEditorModalClose} />
          <div className={classes.dialogTitle}>
            { fieldSelected ?
              <Typography variant="h6">{fieldSelected.fieldname}</Typography>
              :<Typography variant="h6">Select Field</Typography>
            }
            {modalState ? (
              <IconButton aria-label="Close" className={classes.closeButton} onClick={close}>
                <CloseIcon fontSize="large"/>
              </IconButton>
            ) : null}
          </div>
          <div style={{ display: 'flex' }}>
            <Button
              variant="outlined"
              className={classes.controlButton}
              onClick={this.handleFieldCreate}>
              <AddBoxIcon className={classes.controlLeftIcon} />
              Create
            </Button>
            <Button
              variant={ editState? "contained":"outlined" }
              color={ editState? "primary":"inherit" }
              className={classes.controlButton}
              onClick={this.toggleEdit}>
              <EditIcon className={classes.controlLeftIcon} />
              Edit
            </Button>
            <div style={{ flex: 1 }}></div>
            <Button
              variant={ deleteState? "contained":"outlined" }
              color={ deleteState? "primary":"inherit" }
              className={classes.controlButton}
              onClick={this.toggleDelete}>
              <DeleteIcon className={classes.controlLeftIcon} />
              Delete
            </Button>
          </div>
          <Divider variant="middle" />
          <div className={classes.searchBox}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search"
              onChange={(e)=>this.setState({ searchData: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.dialogContent}>
            <List>
              {fieldData ?
                fieldData.filter((item)=>{
                    return (
                      (item.fieldname.search(searchData) !== -1) ||
                      (item.fieldname.toLowerCase().search(searchData.toLowerCase()) !== -1)
                    )
                  }).slice( 0 , visible ).map( d =>
                    <ListItem button onClick={()=>this.handleSelect(d)}>
                      <ListItemText primary={d.fieldname} />
                      { editState &&
                        <ListItemSecondaryAction>
                          <IconButton onClick={()=>this.handleFieldEdit(d)}>
                            <EditIcon fontSize="small"/>
                          </IconButton>
                        </ListItemSecondaryAction>
                      }
                      { deleteState &&
                        <ListItemSecondaryAction>
                          <IconButton onClick={()=>this.handleFieldDelete(d)}>
                            <DeleteIcon fontSize="small"/>
                          </IconButton>
                        </ListItemSecondaryAction>
                      }
                    </ListItem>
                ):<p>Loading ... </p>
              }
            </List>
          </div>
          { fieldData ?
            visible < fieldData.length &&
            <Button
              color="primary"
              className={classes.loadmoreButton}
              onClick={this.handleLoadmore}>Loadmore</Button>:null
          }
          <Button
            color="primary"
            variant="contained"
            className={classes.saveButton}
            onClick={this.handleSave}>Save</Button>
        </div>
      </Modal>
    );
  }
}

export default withStyles(fieldDialogStyles)(FieldDialog);
