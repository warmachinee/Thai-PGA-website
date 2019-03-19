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
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Input from '@material-ui/core/Input';

import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

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
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    paddingLeft: 0
  },
  dialogContent: {
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
    top: theme.spacing.unit * 2,
    color: theme.palette.grey[500],
  },
  searchBox: {
    margin: theme.spacing.unit * 2,
  },
  loadmoreButton: {
    height: 56
  }
});

class UserListDialog extends React.Component {
  state = {
    searchUser: '',
    snackBarState: false,
    snackBarMessage: null,
    snackBarVariant: null,
    userListVisible: 10,
    createState: false,
    createIndex: 0,
    createArr: [],
    arrPlayerFullname: [],
    arrPlayerLastname: []
  }
  toggleCreate = () =>{
    this.setState( prev =>{
      return { createState: !prev.createState }
    })
  }
  handleAddItem = () =>{
    const { createIndex, createArr, arrPlayerFullname, arrPlayerLastname } = this.state
    this.setState( state =>{
      return {
        createIndex: state.createIndex + 1,
      }
    })
    createArr.push(createIndex)
    arrPlayerFullname.push('')
    arrPlayerLastname.push('')
  }
  handleRemoveItem = () =>{
    const { createIndex, createArr, arrPlayerFullname, arrPlayerLastname } = this.state
    this.setState( state =>{
      return {
        createIndex: (state.createIndex === 0)? 0:state.createIndex - 1,
        createArr: state.createArr.slice( 0 , createArr.length - 1 ),
        arrPlayerFullname: state.arrPlayerFullname.slice( 0 , arrPlayerFullname.length - 1 ),
        arrPlayerLastname: state.arrPlayerLastname.slice( 0 , arrPlayerLastname.length - 1 )
      }
    })
  }
  onChangeFullname = (index, value) =>{
    this.state.arrPlayerFullname[index] = value
  }
  onChangeLastname = (index, value) =>{
    this.state.arrPlayerLastname[index] = value
  }
  handleClose = () =>{
    this.handleLoadUserMatch()
    this.props.close()
  }
  handleAddPlayer = (player) =>{
    this.fetchAddPlayer(player)
  }
  handleUserListLoadmore = () =>{
    this.setState( prev =>{
      return { userListVisible: prev.userListVisible + 10 }
    })
  }
  handleUserListLoadless = () =>{
    this.setState({ userListVisible: 10 })
  }
  handleCreatePlayer = () =>{
    this.fetchCreatePlayer()
  }
  async fetchCreatePlayer(){
    const { arrPlayerFullname, arrPlayerLastname } = this.state
    let full = arrPlayerFullname.filter( item => item !== '')
    let last = arrPlayerLastname.filter( item => item !== '')
    if( (full.length && last.length) > 0 ){
      if(full.length === last.length){
        const data = await fetchPostUrl('https://tofftime.com/api/adminregister',{
          fullname: full,
          lastname: last
        })
        console.log(data);
        this.handleLoadUser()
        this.setState({
          snackBarState: true,
          snackBarMessage: 'Right',
          snackBarVariant: 'success'
        })
      }else{
        this.setState({
          snackBarState: true,
          snackBarMessage: 'Please fill data correctly',
          snackBarVariant: 'error'
        })
      }
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: 'Please insert data',
        snackBarVariant: 'error'
      })
    }
  }
  async fetchAddPlayer(player){
    const data = await fetchPostUrl('https://tofftime.com/api/matchadduser',{
      userid: parseInt(this.props.adminData.id),
      matchid: this.props.selectedMatch.matchid,
      target: player.userid
    })
    if(data.status === 'success'){
      this.setState({
        snackBarState: true,
        snackBarMessage: data.status,
        snackBarVariant: 'success'
      })
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: data.status,
        snackBarVariant: 'error'
      })
    }
  }
  async handleLoadUserMatch(){
    const user = await fetchPostUrl('https://tofftime.com/api/loadusermatch',{
      matchid: this.props.selectedMatch.matchid
    })
    let tempData = []
    let tempClass = []
    let tempPlayoffData = []
    let tempUserMatchClassname = []
    for(var i = 0;i < user.userid.length;i++){
      tempData.push({
        index: i,
        userid: user.userid[i],
        fullname: user.fullname[i],
        lastname: user.lastname[i],
        display: user.display[i],
        score: user.score[i],
        in: user.in[i],
        out: user.out[i],
        gross: user.gross[i],
        par: user.par[i]
      })
    }
    for(var i = 0;i < user.classname.length;i++){
      tempClass.push(user.classname[i])
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
    this.props.afterAddPlayer( tempData, tempUserMatchClassname, tempClass, user.playoff, tempPlayoffData )
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
    this.props.afterCreatePlayer(tempData)
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
    const { classes, close, modalState, userListData, adminData } = this.props;
    const {
      userListVisible, searchUser, snackBarState, snackBarMessage, snackBarVariant,
      createState, createIndex, createArr
    } = this.state
    return (
      <Modal
        open={modalState}
        onClose={this.handleClose}
      >
        <div className={classes.dialog} style={{ maxHeight: window.innerHeight }}>
          <div className={classes.dialogTitle}>
            <Typography variant="h6" style={{ marginLeft: 16, marginBottom: 8 }}>User list</Typography>
            <Divider variant="middle" />
            <div style={{ display: 'flex' }}>
              <Button style={{ marginTop: 16, padding: "8px 16px" }}
                variant={createState?"contained":"text"}
                onClick={this.toggleCreate}
                color="primary">
                Create
              </Button>
              <div style={{flex:1}}></div>
              { createState &&
                <Button style={{ marginTop: 16, padding: 8, paddingRight: 16 }}
                  onClick={this.handleCreatePlayer}
                  color="primary">
                  Save
                </Button>
              }
            </div>
            {modalState ? (
              <IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleClose}>
                <CloseIcon fontSize="large"/>
              </IconButton>
            ) : null}
          </div>
          { createState &&
            <div style={{ display: 'flex' }}>
              <Button onClick={this.handleAddItem}>
                <AddCircleIcon style={{ marginRight: 8 }}/>
                Add
              </Button>
              <div style={{flex:1}}></div>
              <Button onClick={()=>console.log(
                  this.state.arrPlayerFullname.filter( item => item !== ''),
                  this.state.arrPlayerLastname.filter( item => item !== '')
                )}>
                Show
              </Button>
              <Button onClick={this.handleRemoveItem}>
                <DeleteIcon style={{ marginRight: 8 }}/>
                Remove
              </Button>
            </div>
          }
          { createState ?
            <div className={classes.dialogContent} style={{ maxHeight: window.innerHeight * .7 }}>
              <List>
                {createArr.map( d=>
                  <ListItem button>
                    <ListItemText primary={
                      <Input
                        placeholder="Fullname"
                        inputProps={{
                          'aria-label': 'Description',
                        }}
                        onChange={(e)=>this.onChangeFullname(d,e.target.value)}
                      />
                      } />
                    <ListItemText primary={
                      <Input
                        placeholder="Lastname"
                        inputProps={{
                          'aria-label': 'Description',
                        }}
                        onChange={(e)=>this.onChangeLastname(d,e.target.value)}
                      />
                      } />
                  </ListItem>
                )}
              </List>
            </div>:
            <React.Fragment>
              <div className={classes.searchBox}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search"
                  onChange={(e)=>this.setState({ searchUser: e.target.value })}
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
              <div className={classes.dialogContent} style={{ maxHeight: window.innerHeight * .7 }}>
                <List>
                  { userListData ?
                    userListData.filter((item)=>{
                        return (
                          (item.fullname.search(searchUser) !== -1) ||
                          (item.fullname.toLowerCase().search(searchUser.toLowerCase()) !== -1)||
                          (item.lastname.search(searchUser) !== -1) ||
                          (item.lastname.toLowerCase().search(searchUser.toLowerCase()) !== -1)
                        )
                      }).slice( 0 , userListVisible ).map( d =>
                      <ListItem button onClick={()=>this.handleAddPlayer(d)}>
                        <IconButton onClick={()=>this.handleAddPlayer(d)}>
                          <AddBoxIcon fontSize="small"/>
                        </IconButton>
                        <ListItemText primary={d.fullname + " " + d.lastname} />
                      </ListItem>
                    ) :<p>Loading ...</p>
                  }
                </List>
                { userListData &&
                  (userListVisible < userListData.length ?
                  <Button
                    fullWidth
                    className={classes.loadmoreButton}
                    onClick={this.handleUserListLoadmore}>
                    <IconButton disabled>
                      <KeyboardArrowDownIcon disabled />
                    </IconButton>
                  </Button>:
                  (userListData.length > 10 &&
                  <Button
                    fullWidth
                    className={classes.loadmoreButton}
                    onClick={this.handleUserListLoadless}>
                    <IconButton disabled>
                      <KeyboardArrowUpIcon disabled />
                    </IconButton>
                  </Button>))
                }
              </div>
            </React.Fragment>
          }

          <SnackBarAlert
            variant={snackBarVariant}
            autoHideDuration={2000}
            open={snackBarState}
            onClose={()=>this.setState({ snackBarState: false })}
            message={snackBarMessage}/>
        </div>
      </Modal>
    );
  }
}

UserListDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserListDialog);
