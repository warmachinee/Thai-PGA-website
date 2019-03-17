import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl, fetchPostUrl } from '../../data/api'

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

import MatchEditorDialog from '../Dialog/MatchEditorDialog'
import UserListDialog from '../Dialog/UserListDialog'
import UserListInMatchDialog from '../Dialog/UserListInMatchDialog'

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
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import lightBlue from "@material-ui/core/colors/lightBlue";
import blue from '@material-ui/core/colors/blue';

const editMatchCardStyles = theme =>({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    maxWidth: 700,
    margin: 'auto'
  },
  heading: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit
  },
  title: {
    textTransform: 'none',
    padding: theme.spacing.unit * 2,
  },
  expandPanelMatch: {
    margin: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  searchBox: {
    margin: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4
  },
  itemList: {
    overflow: 'auto',
    margin: theme.spacing.unit * 2,
    boxSizing: 'border-box',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  controlButton: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: 0,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  controlLeftIcon: {
    marginRight: theme.spacing.unit,
  },
  loadmoreButton: {
    height: 56
  },
})

const EditMatchCard = withStyles(editMatchCardStyles)(
  class extends React.Component<Props> {
    state = {
      matchEditorModalState: false,
      userListModalState: false,
      userListInMatchModalState: false,
      expanded: false,
      matchData: null,
      userMatchData: null,
      userMatchClassname: null,
      userListData: null,
      selectedMatch: null,
      selectedMatchClass: null,
      searchData: '',
      editState: false,
      editClassState: false,
      deleteState: false,
      matchEditorData: {
        type: null,
        matchid: null,
        matchname: null
      },
      matchListVisible: 5,
      userListVisible: 10,
      arrEditClass: []
    }
    toggleEdit = () =>{
      this.setState( prev =>{
        return {
          editState: !prev.editState ,
          editClassState: false,
          deleteState: false
        }
      })
    }
    toggleEditClass = () =>{
      this.setState( prev =>{
        return {
          editState:  false,
          editClassState: !prev.editClassState,
          deleteState: false
        }
      })
    }
    toggleDelete = () =>{
      this.setState( prev =>{
        return {
          editState: false,
          editClassState: false,
          deleteState: !prev.deleteState
        }
      })
    }

    handleMatchListLoadmore = () =>{
      this.setState( prev =>{
        return { matchListVisible: prev.matchListVisible + 5 }
      })
    }
    handleUserListLoadmore = () =>{
      this.setState( prev =>{
        return { userListVisible: prev.userListVisible + 10 }
      })
    }
    handleEditMatch = (d) =>{
      console.log(d);
      this.setState({ matchEditorData: {
        type: 'Edit match',
        matchid: d.matchid
      }})
      this.handleMatchEditor()
    }
    handleDeleteMatch = (d) =>{
      this.setState({ matchEditorData: {
        type: 'Delete match',
        matchid: d.matchid,
        matchname: d.matchname
      }})
      this.handleMatchEditor()
    }
    handleExpand = () =>{
      this.setState((prev)=>{
        return {expanded: !prev.expanded}
      })
    }
    handleSelect = (d) =>{
      this.setState({ selectedMatch: d })
      this.handleExpand()
      this.handleLoadUserMatch(d.matchid)
      this.handleLoadUser()
    }
    handleUserListModal = () =>{
      this.setState({ userListModalState: true })
    }
    handleUserListModalClose = () =>{
      this.setState({ userListModalState: false })
    }
    handleUserListInMatchModal = () =>{
      this.setState({ userListInMatchModalState: true })
    }
    handleUserListInMatchModalClose = () =>{
      this.setState({ userListInMatchModalState: false })
    }

    handleMatchEditor = () =>{
      this.setState({ matchEditorModalState: true })
    }
    handleMatchEditorClose = () =>{
      this.setState({ matchEditorModalState: false })
    }
    handleAddPlayer = () =>{
      this.handleLoadUser()
      this.handleUserListModal()
    }
    handleClassEdit = (i, value) =>{
      const { arrEditClass } = this.state
      arrEditClass[i] = value
    }
    handleClassEditClass = () =>{
      this.fetchClassEdit()
    }

    afterEditor = (data) =>{
      this.setState({ matchData: data })
    }
    afterAddPlayer = (data, classname, arrEditClass) =>{
      this.setState({
        userMatchData: data,
        userMatchClassname: classname,
        arrEditClass: arrEditClass
      })
    }
    afterEditPlayerInMatch = (data, classname, arrEditClass) =>{
      this.setState({
        userMatchData: data,
        userMatchClassname: classname,
        arrEditClass: arrEditClass
      })
    }
    afterDeleteMatch = () =>{
      this.setState({ selectedMatch: null })
    }
    async handleLoadUser(){
      const user = await fetchPostUrl('https://thai-pga.com/api/loaduser',{
        userid: this.props.adminData? parseInt(this.props.adminData.id) : null
      })
      let tempData = []
      for(var i = 0;i < user.userid.length;i++){
        tempData.push({
          userid: user.userid[i],
          fullname: user.fullname[i],
          lastname: user.lastname[i]
        })
      }
      this.setState({ userListData: tempData })
    }
    async handleLoadUserMatch(matchid){
      const user = await fetchPostUrl('https://thai-pga.com/api/loadusermatch',{
        matchid: matchid
      })
      let tempData = []
      for(var i = 0;i < user.userid.length;i++){
        tempData.push({
          index: i,
          userid: user.userid[i],
          fullname: user.fullname[i],
          lastname: user.lastname[i],
          classno: user.classno[i]
        })
      }
      for(var i = 0;i < user.classname.length;i++){
        this.state.arrEditClass.push(user.classname[i])
      }
      this.setState({
        userMatchData: tempData,
        userMatchClassname: user.classname
      })
    }
    async fetchClassEdit(){
      const { arrEditClass } = this.state
      let addClassno = []
      for(var i = 0;i < arrEditClass.length;i++){
        addClassno[i] = i
      }
      console.log(arrEditClass,addClassno);
      const data = await fetchPostUrl('https://thai-pga.com/api/matcheditclass',{
        userid: parseInt(this.props.adminData.id),
        matchid: this.state.selectedMatch.matchid,
        classno: addClassno,
        classname: arrEditClass
      })
      console.log(data);
    }
    async handleLoadMatch(){
      const match = await fetchUrl('https://thai-pga.com/api/loadmatch')
      /*https://thai-pga.com/api/matchedit
        userid
        matchid
        matchname
        classnum
        date
        typescore
        * fieldid * option
      */

      let tempData = []
      for(var i = 0;i < match.matchid.length;i++){
        tempData.push({
          i: i,
          matchid: match.matchid[i],
          matchname: match.matchname[i],
          date: match.date[i],
          fieldname: match.fieldname[i]
        })
      }
      this.setState({ matchData: tempData })
    }
    componentWillReceiveProps(nextProps) {
      if(this.props.afterCreateMatchData !== nextProps.afterCreateMatchData){
        this.handleLoadMatch()
      }
    }
    componentDidMount(){
      this.handleLoadMatch()
    }
    render() {
      const { classes, adminData } = this.props
      const { matchEditorModalState, userListModalState, userListInMatchModalState } = this.state
      const {
        matchListVisible, userListVisible,
        expanded, matchData,
        userMatchData, userMatchClassname, userListData,
        searchData, selectedMatch, matchEditorData
      } = this.state
      const { editState, editUserState, editClassState ,deleteState, deleteUserState } = this.state
      return (
        <Paper className={classes.root} elevation={2}>
          { matchEditorModalState &&
            <MatchEditorDialog
              matchEditorData={matchEditorData}
              adminData={adminData}
              afterEditor={this.afterEditor}
              afterDeleteMatch={this.afterDeleteMatch}
              modalState={matchEditorModalState}
              close={this.handleMatchEditorClose}/>
          }
          { userListModalState &&
            <UserListDialog
              userListData={userListData}
              adminData={adminData}
              selectedMatch={selectedMatch}
              afterAddPlayer={this.afterAddPlayer}
              modalState={userListModalState}
              close={this.handleUserListModalClose}/>
          }
          { userMatchData && userListInMatchModalState &&
            <UserListInMatchDialog
              userMatchData={userMatchData}
              userMatchClassname={userMatchClassname}
              adminData={adminData}
              selectedMatch={selectedMatch}
              afterEditPlayerInMatch={this.afterEditPlayerInMatch}
              modalState={userListInMatchModalState}
              close={this.handleUserListInMatchModalClose}
              />
          }
          <Typography variant="h6" className={classes.heading}>Edit Match</Typography>
          <Divider variant="middle" />
          <ExpansionPanel
            expanded={expanded}
            onChange={this.handleExpand}
            className={classes.expandPanelMatch}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ padding: 0}}>
              <Typography variant="h6">{selectedMatch ? selectedMatch.matchname:'Match list'}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column', padding: 0 }}>
              <div style={{ display: 'flex', marginRight: 16 }}>
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
              <div className={classes.itemList}>
                <List>
                  {matchData?
                    matchData.filter((item)=>{
                        return (
                          (item.matchname.search(searchData) !== -1) ||
                          (item.matchname.toLowerCase().search(searchData.toLowerCase()) !== -1)
                        )
                      }).slice( 0 , matchListVisible ).map( d=>
                      <ListItem button onClick={()=>this.handleSelect(d)}>
                        <ListItemText primary={d.matchname} />
                        <ListItemSecondaryAction>
                          { editState ?
                            <IconButton
                              onClick={()=>this.handleEditMatch(d)}>
                              <EditIcon fontSize="small"/>
                            </IconButton>
                            :null
                          }
                          { deleteState ?
                            <IconButton
                              onClick={()=>this.handleDeleteMatch(d)}>
                              <DeleteIcon fontSize="small"/>
                            </IconButton>
                            :null
                          }
                        </ListItemSecondaryAction>
                      </ListItem>
                    ):<p>Loading ...</p>
                  }
                </List>
                { matchData ?
                  matchListVisible < matchData.length &&
                  <Button
                    fullWidth
                    onClick={this.handleMatchListLoadmore}
                    className={classes.loadmoreButton}>Loadmore</Button>:null
                }
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <div style={{ display: 'flex', margin: '16px 16px 16px 0' }}>
            <Button
              disabled={!selectedMatch}
              variant="contained"
              color="primary"
              className={classes.controlButton}
              onClick={this.handleAddPlayer}>
              <AddBoxIcon className={classes.controlLeftIcon} />
              Add player
            </Button>
            <div style={{ flex: 1 }}></div>
          </div>

          <ExpansionPanel
            disabled={!selectedMatch}
            className={classes.expandPanelMatch}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ padding: 0}}>
              <Typography variant="h6">Match detail</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column', padding: 0 }}>
              <Typography variant="button" className={classes.title}>Match : {selectedMatch ? selectedMatch.matchname + " ":null}</Typography>
              <Typography variant="button" className={classes.title}>Fieldname : {selectedMatch ? selectedMatch.fieldname + " ":null}</Typography>
              <Typography variant="button" className={classes.title}>Date : {selectedMatch ? selectedMatch.date + " ":null}</Typography>

              <ExpansionPanel className={classes.expandPanelMatch}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ padding: 0}}>
                  <Typography variant="h6">Class</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                  <div style={{ display: 'flex', marginRight: 16, marginTop: 16 }}>
                    <Button
                      style={{ height: 42 }}
                      variant={ editClassState? "contained":"outlined" }
                      color={ editClassState? "primary":"inherit" }
                      className={classes.controlButton}
                      onClick={this.toggleEditClass}>
                      <EditIcon className={classes.controlLeftIcon} />
                      Edit
                    </Button>
                    { editClassState &&
                      <Button
                        style={{ height: 42, paddingLeft: 36, paddingRight: 36 }}
                        onClick={this.handleClassEditClass}
                        color="primary">Save</Button>
                    }
                  </div>
                  <List className={classes.itemList}>
                    { userMatchClassname ?
                      userMatchClassname.map((d , i)=>
                        <ListItem
                          style={{ height: 56 }}
                          button={!editClassState}>
                          <ListItemText
                            primary={
                              editClassState ?
                              <Input
                                defaultValue={d}
                                inputProps={{
                                  'aria-label': 'Description',
                                }}
                                onChange={(e)=>this.handleClassEdit(i,e.target.value)}
                              />:
                              d
                            } />
                        </ListItem>):
                        <p>Loading ...</p>
                      }
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <Button
                color="primary"
                className={classes.title}
                onClick={this.handleUserListInMatchModal}>Player list</Button>
              <Divider variant="h6" />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Paper>
      );
    }
  }
);
export default EditMatchCard;
