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
import TabsEditPlayoff from '../Tabs/TabsEditPlayoff'

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
import Tooltip from '@material-ui/core/Tooltip';
import Collapse from '@material-ui/core/Collapse';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Class';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import lightBlue from "@material-ui/core/colors/lightBlue";
import blue from '@material-ui/core/colors/blue';

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
  scoreEditorPlayerList: {
    margin: theme.spacing.unit * 2,
    border: `1px solid rgba(0, 0, 0, 0.23)`,
    borderRadius: 4,
    maxHeight: 500,
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  scoreEditorTextFieldGrid: {
    margin: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
    marginBottom: 0,
    display: 'flex',
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  scoreTextFieldItem: {
    width: 52,
  },
  itemList: {
    overflow: 'auto',
    margin: theme.spacing.unit * 2,
    boxSizing: 'border-box',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  controlButton: {
    margin: theme.spacing.unit * 2,
  },
  controlLeftIcon: {
    marginRight: theme.spacing.unit,
  },
  loadmoreButtonGrid: {
    width: '100%'
  },
  loadmoreButton: {
    height: 56,
    margin: 'auto'
  },
})

const EditMatchCard = withStyles(editMatchCardStyles)(
  class extends React.Component<Props> {
    state = {
      matchEditorModalState: false,
      userListModalState: false,
      userListInMatchModalState: false,
      expanded: false,
      collapseState: false,
      collapseScoreEditorState: false,
      collapseScoreEditorPlayerState: false,
      collapsePlayoffState: false,
      matchData: null,
      userMatchData: null,
      userMatchClassname: null,
      userListData: null,
      selectedMatch: null,
      selectedMatchClass: null,
      selectedPlayer: null,
      searchData: '',
      searchPlayer: '',
      editState: false,
      matchDisplayState: false,
      editClassState: false,
      editPlayoffState: false,
      deleteState: false,
      matchEditorData: {
        type: null,
        matchid: null,
        matchname: null
      },
      playOffIndex: null,
      playOffData: null,
      playerScore: [],
      consoleIN: 0,
      consoleOUT: 0,
      matchListVisible: 5,
      scoreEditorPlayerVisible: 10,
      arrEditClass: []
    }
    toggleEdit = () =>{
      this.setState( prev =>{
        return {
          editState: !prev.editState ,
          matchDisplayState: false,
          deleteState: false
        }
      })
    }
    toggleMatchDisplay = () =>{
      this.setState( prev =>{
        return {
          editState: false,
          matchDisplayState: !prev.matchDisplayState,
          deleteState: false
        }
      })
    }
    toggleEditClass = () =>{
      this.setState( prev =>{
        return {
          editClassState: !prev.editClassState,
        }
      })
    }
    toggleEditPlayoff = () =>{
      this.setState( prev =>{
        return {
          editPlayoffState: !prev.editPlayoffState,
        }
      })
    }
    toggleDelete = () =>{
      this.setState( prev =>{
        return {
          editState: false,
          matchDisplayState: false,
          deleteState: !prev.deleteState
        }
      })
    }

    handleMatchListLoadmore = () =>{
      this.setState( prev =>{
        return { matchListVisible: prev.matchListVisible + 5 }
      })
    }
    handleMatchListLoadless = () =>{
      this.setState({ matchListVisible: 5 })
    }
    handlePlayerEditorLoadmore = () =>{
      this.setState( prev =>{
        return { scoreEditorPlayerVisible: prev.scoreEditorPlayerVisible + 10 }
      })
    }
    handlePlayerEditorLoadless = () =>{
      this.setState({ scoreEditorPlayerVisible: 10 })
    }
    handleEditMatch = (d) =>{
      console.log(d);
      this.setState({ matchEditorData: {
        type: 'Edit match',
        matchid: d.matchid
      }})
      this.handleMatchEditor()
    }
    handleScoreChange = (score,index) =>{
      const { playerScore } = this.state
      if(score === ""){
        playerScore[index] = 0
      }else{
        playerScore[index] = parseInt(score)
      }
      let tempIN = 0
      let tempOUT = 0
      for(var i = 0;i < 9;i++){
        tempIN += playerScore[i]
      }
      for(var j = 9;j < 18;j++){
        tempOUT += playerScore[j]
      }
      this.setState({
        consoleIN: tempIN,
        consoleOUT: tempOUT
      })
    }
    handleCollapse = () => {
      this.setState(state => ({
        collapseState: !state.collapseState,
        collapseScoreEditorState: false,
        collapseScoreEditorPlayerState: false,
        collapsePlayoffState: false
      }));
    };
    handleScoreEditorCollapse = () =>{
      this.setState(state => ({
        collapseState: false,
        collapseScoreEditorState: !state.collapseScoreEditorState,
        collapseScoreEditorPlayerState: false,
        collapsePlayoffState: false
      }));
    }
    handleScoreEditorPlayerCollapse = () =>{
      this.setState(state => ({
        collapseScoreEditorPlayerState: !state.collapseScoreEditorPlayerState,
      }));
    }
    handlePlayoffCollapse = () =>{
      this.setState(state => ({
        collapseState: false,
        collapseScoreEditorState: false,
        collapseScoreEditorPlayerState: false,
        collapsePlayoffState: !state.collapsePlayoffState
      }));
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
    }
    handleSelectPlayer = (d) =>{
      this.setState({
        consoleIN: d.in,
        consoleOUT: d.out,
        playerScore: d.score,
        selectedPlayer: d,
        collapseScoreEditorPlayerState: false
      })
    }
    handleUserListModal = () =>{
      this.setState({ userListModalState: true })
    }
    handleUserListModalClose = () =>{
      this.setState({ userListModalState: false })
    }

    handleUserListInMatchModal = () =>{
      this.setState({
        userListInMatchModalState: true,
        collapseState: false
      })
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
    handleMatchDisplay = (d) =>{
      this.fetchMatchDisplay(d)
    }
    handleSaveScore = () =>{
      this.fetchCalculateScore()
    }

    afterEditor = (data) =>{
      this.setState({ matchData: data })
    }
    afterAddPlayer = (data, classname, arrEditClass, playoff, playoffData) =>{
      this.setState({
        playOffIndex: playoff,
        playOffData: playoffData,
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
    afterCreatePlayer = (data) =>{
      this.setState({ userListData: data })
    }

    async fetchCalculateScore(){
      const data = await fetchPostUrl('https://tofftime.com/api/matchcalculatescore',{
        userid: parseInt(this.props.adminData.id),
        matchid: this.state.selectedMatch.matchid,
        target: this.state.selectedPlayer.userid,
        score: this.state.playerScore
      })
      console.log(data);
      this.handleLoadUserMatch(this.state.selectedMatch.matchid)

    }
    async handleLoadUser(){
      const user = await fetchPostUrl('https://tofftime.com/api/loaduser',{
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
      const user = await fetchPostUrl('https://tofftime.com/api/loadusermatch',{
        matchid: matchid
      })
      let tempData = []
      let tempPlayoffData = []
      let tempUserMatchClassname = []
      for(var i = 0;i < user.userid.length;i++){
        tempData.push({
          index: i,
          userid: user.userid[i],
          fullname: user.fullname[i],
          lastname: user.lastname[i],
          classno: user.classno[i],
          display: user.display[i],
          score: user.score[i],
          in: user.in[i],
          out: user.out[i],
          gross: user.gross[i],
          par: user.par[i]
        })
      }
      for(var i = 0;i < user.classname.length;i++){
        this.state.arrEditClass.push(user.classname[i])
      }
      for(var i = 0;i < user.fullplayoff.length;i++){
        tempPlayoffData.push({
          fullname: user.fullplayoff[i],
          lastname: user.lastplayoff[i]
        })
      }
      for(var i = 0;i < user.classname.length + 1;i++){
        if(i === 0){
          tempUserMatchClassname.push('-')
        }else{
          tempUserMatchClassname.push(user.classname[i-1])
        }
      }
      this.setState({
        playOffIndex: user.playoff,
        playOffData: tempPlayoffData,
        userMatchData: tempData,
        userMatchClassname: tempUserMatchClassname
      })
    }
    async fetchClassEdit(){
      const { arrEditClass } = this.state
      let addClassno = []
      for(var i = 0;i < arrEditClass.length;i++){
        addClassno[i] = i + 1
      }
      const data = await fetchPostUrl('https://tofftime.com/api/matcheditclass',{
        userid: parseInt(this.props.adminData.id),
        matchid: this.state.selectedMatch.matchid,
        classno: addClassno,
        classname: arrEditClass
      })
      if(data.status === 'success'){
        this.handleLoadUserMatch(this.state.selectedMatch.matchid)
      }else{
        this.props.handleSnackBar( true, data.status, 'error' )
      }
    }
    async fetchMatchDisplay(d){
      const data = await fetchPostUrl('https://tofftime.com/api/matchcheckdisplay',{
        userid: parseInt(this.props.adminData.id),
        matchid: d.matchid,
      })
      this.handleLoadMatch()
    }
    async handleLoadMatch(){
      const match = await fetchUrl('https://tofftime.com/api/loadmatch')
      /*https://tofftime.com/api/matchedit
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
          fieldname: match.fieldname[i],
          display: match.display[i],
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
        matchListVisible, scoreEditorPlayerVisible,
        expanded, matchData, playerScore, consoleIN, consoleOUT,
        userMatchData, userMatchClassname, userListData, playOffIndex, playOffData,
        searchData, searchPlayer, selectedMatch, selectedPlayer, matchEditorData
      } = this.state
      const {
        editState, editUserState, matchDisplayState, editClassState ,deleteState, deleteUserState, editPlayoffState,
        collapseState, collapseScoreEditorState, collapseScoreEditorPlayerState, collapsePlayoffState
      } = this.state
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
              afterCreatePlayer={this.afterCreatePlayer}
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
                <Tooltip title="Edit match" placement="bottom">
                  <IconButton
                    color={ editState? "primary":"inherit" }
                    className={classes.controlButton}
                    onClick={this.toggleEdit}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit match display" placement="bottom">
                  <IconButton
                    color={ matchDisplayState? "primary":"inherit" }
                    className={classes.controlButton}
                    onClick={this.toggleMatchDisplay}>
                    <PersonalVideoIcon />
                  </IconButton>
                </Tooltip>
                <div style={{ flex: 1 }}></div>
                <Tooltip title="Delete match" placement="bottom">
                  <IconButton
                    color={ deleteState? "secondary":"inherit" }
                    className={classes.controlButton}
                    onClick={this.toggleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
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
                        <IconButton disabled>
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
                      <ListItem button
                        onClick={()=>matchDisplayState ?
                          this.handleMatchDisplay(d)
                          :this.handleSelect(d)
                        }>
                        <ListItemText primary={d.matchname} />
                        <ListItemSecondaryAction>
                          { editState &&
                            <IconButton
                              onClick={()=>this.handleEditMatch(d)}>
                              <EditIcon fontSize="small"/>
                            </IconButton>
                          }
                          { matchDisplayState &&
                            <Checkbox
                              onChange={()=>this.handleMatchDisplay(d)}
                              checked={ (d.display === 1)? true:false }
                              />
                          }
                          { deleteState &&
                            <IconButton
                              onClick={()=>this.handleDeleteMatch(d)}>
                              <DeleteIcon fontSize="small"/>
                            </IconButton>
                          }
                        </ListItemSecondaryAction>
                      </ListItem>
                    ):<p>Loading ...</p>
                  }
                </List>
                { matchData &&
                  (matchListVisible < matchData.length ?
                  <Button
                    fullWidth
                    className={classes.loadmoreButton}
                    onClick={this.handleMatchListLoadmore}>
                    <IconButton disabled>
                      <KeyboardArrowDownIcon disabled />
                    </IconButton>
                  </Button>:
                  (matchData.length > 5 &&
                  <Button
                    fullWidth
                    className={classes.loadmoreButton}
                    onClick={this.handleMatchListLoadless}>
                    <IconButton disabled>
                      <KeyboardArrowUpIcon disabled />
                    </IconButton>
                  </Button>))
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

              <List>
                <ListItem button
                  onClick={this.handleCollapse}
                  style={{ height: 48 }}>
                  <ListItemText inset
                    primary={<Typography variant="button" style={{ textTransform: 'none' }}>Class list</Typography>}
                    style={{ padding: 0}}/>
                  {collapseState ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </List>
              <Collapse in={collapseState} timeout="auto" unmountOnExit>
                <div style={{ display: 'flex', marginRight: 16, marginTop: 16 }}>
                  <Button
                    variant={ editClassState? "contained":"outlined" }
                    color={ editClassState? "primary":"inherit" }
                    className={classes.controlButton}
                    onClick={this.toggleEditClass}>
                    <EditIcon className={classes.controlLeftIcon} />
                    Edit
                  </Button>
                  { editClassState &&
                    <Button
                      style={{ paddingLeft: 36, paddingRight: 36 }}
                      className={classes.controlButton}
                      onClick={this.handleClassEditClass}
                      color="primary">Save</Button>
                  }
                </div>
                <List className={classes.itemList}>
                  { userMatchClassname ?
                    userMatchClassname.filter((item,i) =>{
                      return i > 0
                    }).map((d , i)=>
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
              </Collapse>

              <List>
                <ListItem button
                  onClick={this.handlePlayoffCollapse}
                  style={{ height: 48 }}>
                  <ListItemText inset
                    primary={<Typography variant="button" style={{ textTransform: 'none' }}>Play off editor</Typography>}
                    style={{ padding: 0}}/>
                  {collapsePlayoffState ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </List>
              <Collapse in={collapsePlayoffState} timeout="auto" unmountOnExit>
                <div style={{ display: 'flex', marginRight: 16, marginTop: 16 }}>
                  <Button
                    variant={ editPlayoffState? "contained":"outlined" }
                    color={ editPlayoffState? "primary":"inherit" }
                    onClick={this.toggleEditPlayoff}
                    className={classes.controlButton}>
                    <EditIcon className={classes.controlLeftIcon} />
                    Edit
                  </Button>
                </div>
                <TabsEditPlayoff
                  handleSnackBar={this.props.handleSnackBar}
                  afterAddPlayer={this.afterAddPlayer}
                  adminData={adminData}
                  selectedMatch={selectedMatch}
                  editPlayoffState={editPlayoffState}
                  playOffData={playOffData}
                  playOffIndex={playOffIndex}
                  userMatchClassname={userMatchClassname}/>
              </Collapse>

              <Button
                color="primary"
                className={classes.title}
                onClick={this.handleUserListInMatchModal}>Player list</Button>
              <Divider variant="h6" />
              <List>
                <ListItem button
                  onClick={this.handleScoreEditorCollapse}
                  style={{ height: 48 }}>
                  <ListItemText inset
                    primary={<Typography variant="button" style={{ textTransform: 'none' }}>Score Editor</Typography>}
                    style={{ padding: 0}}/>
                  {collapseScoreEditorState ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </List>
              <Collapse in={collapseScoreEditorState} timeout="auto" unmountOnExit >
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: 16, marginTop: 16, marginBottom: 64 }}>
                  <div className={classes.searchBox}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Search"
                      onChange={(e)=>this.setState({ searchPlayer: e.target.value })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton disabled>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <List>
                    <ListItem button
                      onClick={this.handleScoreEditorPlayerCollapse}
                      style={{ height: 48, margin: '0 8px' }}>
                      <ListItemText inset
                        primary={
                          <Typography
                            variant="button"
                            style={{ textTransform: 'none' }}>
                            { selectedPlayer ?
                              selectedPlayer.fullname + " " + selectedPlayer.lastname
                              :'Select player'
                            }
                          </Typography>}
                        style={{ padding: 0}}/>
                      {collapseScoreEditorPlayerState ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                  </List>
                  <Collapse in={collapseScoreEditorPlayerState} timeout="auto" unmountOnExit
                    className={classes.scoreEditorPlayerList}>
                    <List>
                      { userMatchData ?
                        userMatchData.filter( item =>{
                          return (
                            (item.fullname.search(searchPlayer) !== -1) ||
                            (item.fullname.toLowerCase().search(searchPlayer.toLowerCase()) !== -1)||
                            (item.lastname.search(searchPlayer) !== -1) ||
                            (item.lastname.toLowerCase().search(searchPlayer.toLowerCase()) !== -1)
                          )
                        }).slice( 0 , scoreEditorPlayerVisible ).map( d =>
                        <ListItem button onClick={()=>this.handleSelectPlayer(d)}>
                          <ListItemText primary={d.fullname + " " + d.lastname} />
                        </ListItem>):
                        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map( d =>
                        <ListItem button>
                          <ListItemText primary={d} />
                        </ListItem>
                      )}
                    </List>
                    { userMatchData &&
                      (scoreEditorPlayerVisible < userMatchData.length ?
                      <Button
                        fullWidth
                        className={classes.loadmoreButton}
                        onClick={this.handlePlayerEditorLoadmore}>
                        <IconButton disabled>
                          <KeyboardArrowDownIcon disabled />
                        </IconButton>
                      </Button>:
                      (userMatchData.length > 10 &&
                      <Button
                        fullWidth
                        className={classes.loadmoreButton}
                        onClick={this.handlePlayerEditorLoadless}>
                        <IconButton disabled>
                          <KeyboardArrowUpIcon disabled />
                        </IconButton>
                      </Button>))
                    }
                  </Collapse>
                  <Typography variant="button" style={{ textTransform: 'none', margin: '0 24px' }}>Score</Typography>
                  { selectedPlayer &&
                    <React.Fragment>
                      <div className={classes.scoreEditorTextFieldGrid}>
                        {playerScore.slice( 0 , 9).map( (d, i) =>
                          <div style={{ margin: 'auto' }}>
                            <MuiThemeProvider theme={inputTheme}>
                              <TextField
                                key={i}
                                className={classes.scoreTextFieldItem}
                                value={d}
                                label={"0" + (i + 1)}
                                margin="normal"
                                variant="outlined"
                                onChange={(e)=>this.handleScoreChange(e.target.value,i)}/>
                            </MuiThemeProvider>
                          </div>
                        )}
                      </div>
                      <div className={classes.scoreEditorTextFieldGrid}>
                        {playerScore.slice( 9 , 18).map( (d, i) =>
                          <div style={{ margin: 'auto' }}>
                            <MuiThemeProvider theme={inputTheme}>
                              <TextField
                                key={i}
                                className={classes.scoreTextFieldItem}
                                value={d}
                                label={i + 9}
                                margin="normal"
                                variant="outlined"
                                onChange={(e)=>this.handleScoreChange(e.target.value,i + 9)}/>
                            </MuiThemeProvider>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', margin: 24 }}>
                        <Button disabled color="primary">{ "OUT = " + consoleIN }</Button>
                        <Button disabled color="primary">{ "IN = " + consoleOUT }</Button>
                        <Button color="primary">{ "GROSS = " + ( consoleIN + consoleOUT ) }</Button>
                        <div style={{flex:1}}></div>
                        <Button
                          onClick={this.handleSaveScore}
                          color="primary">Save</Button>
                      </div>
                    </React.Fragment>
                  }
                </div>
              </Collapse>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Paper>
      );
    }
  }
);
export default EditMatchCard;
