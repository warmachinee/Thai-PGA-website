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
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';
import Tooltip from '@material-ui/core/Tooltip';

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
    maxWidth: 800,
    width: '100%',
    minWidth: 300,
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit
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
  controlButton: {
    margin: theme.spacing.unit * 2,
  },
  controlLeftIcon: {
    marginRight: theme.spacing.unit,
  },
  searchBox: {
    margin: theme.spacing.unit * 2,
  },
  loadmoreButton: {
    height: 56
  },
});

class UserListInMatchDialog extends React.Component {
  state = {
    searchUser: '',
    anchorEl: null,
    snackBarState: false,
    snackBarMessage: null,
    snackBarVariant: null,
    userListVisible: 10,
    editNameState: false,
    editClassState: false,
    playerDisplayState: false,
    deleteState: false,
    arrEdit: {
      fullname: [],
      lastname: []
    },
    classChecked: [],
    classSelected: null
  }
  toggleEditName = () =>{
    this.setState( prev =>{
      return {
        editNameState: !prev.editNameState ,
        editClassState: false ,
        playerDisplayState: false,
        deleteState: false
      }
    })
  }
  toggleEditClass = () =>{
    this.setState( prev =>{
      return {
        editNameState: false ,
        editClassState: !prev.editClassState ,
        playerDisplayState: false,
        deleteState: false
      }
    })
  }
  togglePlayerDisplay = () =>{
    this.setState( prev =>{
      return {
        editNameState: false ,
        editClassState: false ,
        playerDisplayState: !prev.playerDisplayState,
        deleteState: false
      }
    })
  }
  toggleDelete = () =>{
    this.setState( prev =>{
      return {
        editNameState: false,
        editClassState: false ,
        deleteState: !prev.deleteState
      }
    })
  }
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };
  handleSelectMenu = (i) =>{
    this.setState({ classSelected: parseInt(i) })
    this.handleMenuClose()
  }
  handleEditClass = () =>{
    const { classChecked, classSelected } = this.state
    let classno = []
    for(var i = 0;i < classChecked.length;i++){
      classno.push(classSelected)
    }
    this.fetchUserClassEdit(classChecked, classno)
  }
  handleFullnameChange = ( value, d, i ) =>{
    const { arrEdit } = this.state
    if( value === ""){
      arrEdit.fullname[i] = this.props.userMatchData[i].fullname
    }else{
      arrEdit.fullname[i] = value
    }
  }
  handleLastnameChange = ( value, d, i ) =>{
    const { arrEdit } = this.state
    if( value === ""){
      arrEdit.lastname[i] = this.props.userMatchData[i].lastname
    }else{
      arrEdit.lastname[i] = value
    }
  }
  handleUserListLoadmore = () =>{
    this.setState( prev =>{
      return { userListVisible: prev.userListVisible + 10 }
    })
  }
  handleUserListLoadless = () =>{
    this.setState({ userListVisible: 10 })
  }

  handleRemoveUser = (d) =>{
    this.fetchRemoveUser(d)
  }
  handleUserEdit = (d) =>{
    this.fetchUserEdit(d)
  }
  handleClose = () =>{
    this.handleLoadUserMatch()
    this.props.close()
  }
  handlePlayerDisplay = (d) =>{
    this.fetchPlayerDisplay(d)
  }
  handleEditClassChecked = (d) =>{
    const { classChecked } = this.state;
    const currentIndex = classChecked.indexOf(d.userid);
    const newChecked = [...classChecked];
    if (currentIndex === -1) {
      newChecked.push(d.userid);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({
      classChecked: newChecked,
    });
  }
  async fetchRemoveUser(d){
    const data = await fetchPostUrl('https://www.tofftime.com/api/matchremoveuser',{
      userid: parseInt(this.props.adminData.id),
      matchid: this.props.selectedMatch.matchid,
      target: d.userid
    })
    if(data.status === 'success'){
      this.handleLoadUserMatch()
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: data.status,
        snackBarVariant: 'error'
      })
    }
  }
  async fetchUserClassEdit(arrUserid, arrClassno){
    const data = await fetchPostUrl('https://www.tofftime.com/api/matchedituserclass',{
      userid: parseInt(this.props.adminData.id),
      matchid: this.props.selectedMatch.matchid,
      target: arrUserid,
      classno: arrClassno
    })
    console.log(data);
    this.handleLoadUserMatch()
  }
  async fetchPlayerDisplay(d){
    const data = await fetchPostUrl('https://www.tofftime.com/api/matchcheckuserdisplay',{
      userid: parseInt(this.props.adminData.id),
      matchid: this.props.selectedMatch.matchid,
      target: d.userid,
    })
    console.log(data);
    this.handleLoadUserMatch()
  }
  async fetchUserEdit(d){
    const data = await fetchPostUrl('https://www.tofftime.com/api/useredit',{
      userid: parseInt(this.props.adminData.id),
      fullname: this.state.arrEdit.fullname[d.index],
      lastname: this.state.arrEdit.lastname[d.index],
      target: d.userid
    })
    if(data.status === 'success'){
      this.handleLoadUserMatch()
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
    this.props.afterEditPlayerInMatch( tempData, tempUserMatchClassname, tempClass, user.playoff, tempPlayoffData )
  }
  handleRefresh = () =>{
    this.setState(this.state)
  }
  componentDidMount(){
    const { userMatchData } = this.props
    for(var i = 0;i < userMatchData.length;i++){
      this.state.arrEdit.fullname[i] = userMatchData[i].fullname
      this.state.arrEdit.lastname[i] = userMatchData[i].lastname
    }
    window.addEventListener('resize',this.handleRefresh)
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.handleRefresh)
  }
  render() {
    const { classes, close, modalState, userMatchData, userMatchClassname, adminData, selectedMatch } = this.props;
    const { userListVisible, searchUser, snackBarState, snackBarMessage, snackBarVariant, classSelected } = this.state
    const { editNameState, editClassState, playerDisplayState, deleteState, anchorEl } = this.state
    return (
      <Modal
        open={modalState}
        onClose={this.handleClose}
      >
        <div className={classes.dialog} style={{ maxHeight: window.innerHeight }}>
          <div className={classes.dialogTitle}>
            <Typography variant="h6">User list ({ " " + selectedMatch.matchname + " " })</Typography>
            {modalState ? (
              <IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleClose}>
                <CloseIcon fontSize="large"/>
              </IconButton>
            ) : null}
          </div>
          <Divider variant="middle" />
          <div style={{ display: 'flex', marginRight: 16, marginTop: 16 }}>
            <Tooltip title="Edit name" placement="bottom">
              <IconButton
                color={ editNameState? "primary":"inherit" }
                className={classes.controlButton}
                onClick={this.toggleEditName}>
                <PersonIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit display" placement="bottom">
              <IconButton
                color={ playerDisplayState? "primary":"inherit" }
                className={classes.controlButton}
                onClick={this.togglePlayerDisplay}>
                <PersonalVideoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit class" placement="bottom">
              <IconButton
                color={ editClassState? "primary":"inherit" }
                className={classes.controlButton}
                onClick={this.toggleEditClass}>
                <ClassIcon />
              </IconButton>
            </Tooltip>
            { window.innerWidth > 650 &&
              <React.Fragment>
                { editClassState &&
                  <Grow in={editClassState} style={{ transitionDelay: editClassState ? '0ms' : '100ms' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ textTransform: 'none' }}
                      className={classes.controlButton}
                      onClick={this.handleMenu}>
                      { classSelected !== null ?
                        userMatchClassname[classSelected]
                        :'Select Class'
                      }
                    </Button>
                  </Grow>
                }
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.handleMenuClose}>
                  {userMatchClassname.map((d,i) =>
                    <MenuItem onClick={()=>this.handleSelectMenu(i)}>{d}</MenuItem>
                  )}
                </Menu>
                { editClassState &&
                  <Grow in={editClassState} style={{ transitionDelay: editClassState ? '100ms' : '0ms' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      className={classes.controlButton}
                      onClick={this.handleEditClass}>
                      Save
                    </Button>
                  </Grow>
                }
              </React.Fragment>
            }
            <div style={{ flex: 1 }}></div>
            <Tooltip title="Delete player" placement="bottom">
              <IconButton
                color={ deleteState? "secondary":"inherit" }
                className={classes.controlButton}
                onClick={this.toggleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
          { window.innerWidth < 650 &&
            <div style={{ display: 'flex', marginRight: 16 }}>
              { editClassState &&
                <Grow in={editClassState} style={{ transitionDelay: editClassState ? '0ms' : '100ms' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ textTransform: 'none' }}
                    className={classes.controlButton}
                    onClick={this.handleMenu}>
                    { classSelected !== null ?
                      userMatchClassname[classSelected]
                      :'Select Class'
                    }
                  </Button>
                </Grow>
              }
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleMenuClose}>
                {userMatchClassname.map((d,i) =>
                  <MenuItem onClick={()=>this.handleSelectMenu(i)}>{d}</MenuItem>
                )}
              </Menu>
              { editClassState &&
                <Grow in={editClassState} style={{ transitionDelay: editClassState ? '100ms' : '0ms' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.controlButton}
                    onClick={this.handleEditClass}>
                    Save
                  </Button>
                </Grow>
              }
            </div>
          }

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
          <div className={ window.innerWidth > 500 && classes.dialogContent} style={{ maxHeight: window.innerHeight * .6 }}>
            <List>
              { userMatchData ? userMatchData.filter((item)=>{
                  return (
                    (item.fullname.search(searchUser) !== -1) ||
                    (item.fullname.toLowerCase().search(searchUser.toLowerCase()) !== -1) ||
                    (item.lastname.search(searchUser) !== -1) ||
                    (item.lastname.toLowerCase().search(searchUser.toLowerCase()) !== -1)
                  )
                }).slice( 0 , userListVisible ).map( (d, i) =>
                  <ListItem
                    button={ !editNameState }
                    style={{ height: 56 }}
                    onClick={()=>
                      ( editClassState && this.handleEditClassChecked(d)) ||
                      ( playerDisplayState && this.handlePlayerDisplay(d) )
                    }>
                    { editClassState ?
                      <Grow in={editClassState} style={{ transitionDelay: editClassState ? `${30 * i}ms` : '0ms' }}>
                        <Checkbox
                          checked={this.state.classChecked.indexOf(d.userid) !== -1}
                          disableRipple
                          color="primary"
                        />
                      </Grow>
                      :<div style={{ width: 48 }}></div>
                    }
                    <ListItemText
                      style={{ width: window.innerWidth > 500 ?'40%':'100%' }}
                      primary={
                        editNameState ?
                        <div style={{ display: 'flex', width: window.innerWidth < 500 ?'90%':'100%' }}>
                          <Input
                            defaultValue={d.fullname}
                            inputProps={{
                              'aria-label': 'Description',
                            }}
                            onChange={(e)=>this.handleFullnameChange(e.target.value,d,i)}
                          />
                          <Input
                            defaultValue={d.lastname}
                            inputProps={{
                              'aria-label': 'Description',
                            }}
                            onChange={(e)=>this.handleLastnameChange(e.target.value,d,i)}
                          />
                        </div>:
                        <div style={{ display: 'flex'}}>
                          <Typography variant="subtitle1" style={{ width: '100%'}}>{d.fullname}</Typography>
                          <Typography variant="subtitle1" style={{ width: '100%'}}>{d.lastname}</Typography>
                        </div>
                      }
                      secondary={ window.innerWidth < 500 && userMatchClassname[d.classno] }/>
                    { window.innerWidth > 500 &&
                      <ListItemText
                        className={classes.userMatchItemClass}
                        primary={userMatchClassname[d.classno]} />
                    }
                    <ListItemSecondaryAction>
                      { deleteState ?
                        <IconButton onClick={()=>this.handleRemoveUser(d)}>
                          <DeleteIcon fontSize="small"/>
                        </IconButton>
                        :null
                      }
                      { editNameState ?
                        <Button
                          size={ window.innerWidth < 500 ? "small":"default"}
                          color="primary" onClick={()=>this.handleUserEdit(d)}>
                          Save
                        </Button>:null
                      }
                      { playerDisplayState &&
                        <Checkbox
                          onChange={()=>this.handlePlayerDisplay(d)}
                          checked={(d.display === 1)? true:false}
                          />
                      }
                    </ListItemSecondaryAction>
                  </ListItem>
                ):<p>Loading ...</p>
              }
            </List>

            { userMatchData &&
              (userListVisible < userMatchData.length ?
              <Button
                fullWidth
                className={classes.loadmoreButton}
                onClick={this.handleUserListLoadmore}>
                <IconButton disabled>
                  <KeyboardArrowDownIcon disabled />
                </IconButton>
              </Button>:
              (userMatchData.length > 10  &&
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

UserListInMatchDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserListInMatchDialog);
