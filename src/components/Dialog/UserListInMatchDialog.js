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

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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
    maxWidth: 700,
    width: '100%',
    minWidth: 300,
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
    marginLeft: theme.spacing.unit * 2,
    marginRight: 0,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
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
  userMatchItemName: {
    width: '40%'
  },
  userMatchItemClass: {

  }
});

class UserListInMatchDialog extends React.Component {
  state = {
    searchUser: '',
    snackBarState: false,
    snackBarMessage: null,
    snackBarVariant: null,
    userListVisible: 10,
    editNameState: false,
    editClassState: false,
    deleteState: false,
    arrEdit: {
      fullname: [],
      lastname: []
    }
  }
  toggleEditName = () =>{
    this.setState( prev =>{
      return {
        editNameState: !prev.editNameState ,
        editClassState: false ,
        deleteState: false
      }
    })
  }
  toggleEditClass = () =>{
    this.setState( prev =>{
      return {
        editNameState: false ,
        editClassState: !prev.editClassState ,
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
  showData = (d) =>{
    console.log(
      "d : ", d,
      "fullname : ", this.state.arrEdit.fullname[d.index],
      "lastname : ", this.state.arrEdit.lastname[d.index],
      "target : ", this.props.userMatchData[d.index].userid
    );
  }
  handleUserEdit = (d) =>{
    this.fetchUserEdit(d)
  }
  handleClose = () =>{
    this.handleLoadUserMatch()
    this.props.close()
  }
  async fetchUserEdit(d){
    console.log(
      "userid : " ,parseInt(this.props.adminData.id),
      "fullname : " ,this.state.arrEdit.fullname[d.index],
      "lastname : " ,this.state.arrEdit.lastname[d.index],
      "target : " ,this.props.userMatchData[d.index].userid
    );
    const data = await fetchPostUrl('https://www.thai-pga.com/api/useredit',{
      userid: parseInt(this.props.adminData.id),
      fullname: this.state.arrEdit.fullname[d.index],
      lastname: this.state.arrEdit.lastname[d.index],
      target: this.props.userMatchData[d.index].userid
    })
    console.log(data);
    this.handleLoadUserMatch()
  }
  async handleLoadUserMatch(){
    const user = await fetchPostUrl('https://thai-pga.com/api/loadusermatch',{
      matchid: this.props.selectedMatch.matchid
    })
    let tempData = []
    let tempClass = []
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
      tempClass.push(user.classname[i])
    }
    this.props.afterEditPlayerInMatch( tempData, user.classname, tempClass )
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
    const { classes, close, modalState, userMatchData, userMatchClassname, adminData } = this.props;
    const { userListVisible, searchUser, snackBarState, snackBarMessage, snackBarVariant } = this.state
    const { editNameState, editClassState, deleteState } = this.state
    return (
      <Modal
        open={modalState}
        onClose={this.handleClose}
      >
        <div className={classes.dialog} style={{ maxHeight: window.innerHeight }}>
          <div className={classes.dialogTitle}>
            <Typography variant="h6">User list</Typography>
            {modalState ? (
              <IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleClose}>
                <CloseIcon fontSize="large"/>
              </IconButton>
            ) : null}
          </div>
          <Divider variant="middle" />
          <div style={{ display: 'flex', marginRight: 16, marginTop: 16 }}>
            <Button
              variant={ editNameState? "contained":"outlined" }
              color={ editNameState? "primary":"inherit" }
              className={classes.controlButton}
              onClick={this.toggleEditName}>
              <EditIcon className={classes.controlLeftIcon} />
              Name
            </Button>
            <Button
              variant={ editClassState? "contained":"outlined" }
              color={ editClassState? "primary":"inherit" }
              className={classes.controlButton}
              onClick={this.toggleEditClass}>
              <EditIcon className={classes.controlLeftIcon} />
              Class
            </Button>
            <Button
              className={classes.controlButton}
              onClick={()=>console.log(userMatchData)}>
              Data
            </Button>
            <Button
              className={classes.controlButton}
              onClick={()=>console.log(this.state.arrEdit)}>
              ShowData
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
              onChange={(e)=>this.setState({ searchUser: e.target.value })}
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
          <div className={classes.dialogContent} style={{ maxHeight: window.innerHeight * .6 }}>
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
                    onClick={()=> !editNameState ? console.log(d):null}>
                    { editClassState ?
                      <Checkbox
                        disableRipple
                      />:<div style={{ width: 48 }}></div>
                    }
                    <ListItemText
                      className={classes.userMatchItemName}
                      primary={
                        editNameState ?
                        <div style={{ display: 'flex'}}>
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
                      }/>
                    <ListItemText
                      className={classes.userMatchItemClass}
                      primary={userMatchClassname[d.classno]} />
                    <ListItemSecondaryAction>
                      { deleteState ?
                        <IconButton>
                          <DeleteIcon fontSize="small"/>
                        </IconButton>
                        :null
                      }
                      { editNameState ?
                        <Button color="primary" onClick={()=>this.handleUserEdit(d)}>
                          Save
                        </Button>:null
                      }
                    </ListItemSecondaryAction>
                  </ListItem>
                )://<p>Loading ...</p>
                [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
                .slice( 0 , userListVisible ).map((d, i) =>
                  <ListItem
                    button={ !editNameState }
                    style={{ height: 56 }}
                    onClick={()=>!editNameState ? console.log(d):null}>
                    { editClassState ?
                      <Checkbox
                        disableRipple
                      />
                      :<div style={{ width: 48 }}></div>
                    }
                    <ListItemText
                      className={classes.userMatchItemName}
                      primary={
                        editNameState ?
                        <div style={{ display: 'flex'}}>
                          <Input
                            defaultValue={"fullname" + d}
                            inputProps={{
                              'aria-label': 'Description',
                            }}
                            onChange={(e)=>this.handleFullnameChange(e.target.value,d,i)}
                          />
                          <Input
                            defaultValue={"lastname" + d}
                            inputProps={{
                              'aria-label': 'Description',
                            }}
                            onChange={(e)=>this.handleLastnameChange(e.target.value,d,i)}
                          />
                        </div>:
                        <div style={{ display: 'flex'}}>
                          <Typography variant="subtitle1" style={{ width: '100%'}}>{"fullname" + d}</Typography>
                          <Typography variant="subtitle1" style={{ width: '100%'}}>{"lastname" + d}</Typography>
                        </div>
                      }
                       />
                    <ListItemText
                      className={classes.userMatchItemClass}
                      primary={"T" + d} />
                    <ListItemSecondaryAction>
                      { deleteState ?
                        <IconButton>
                          <DeleteIcon fontSize="small"/>
                        </IconButton>
                        :null
                      }
                      { editNameState ?
                        <Button color="primary" onClick={()=>this.handleUserEdit(i)}>
                          Save
                        </Button>:null
                      }
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              }
            </List>

            { userMatchData ?
              userListVisible < userMatchData.length &&
              <Button
                fullWidth
                onClick={this.handleUserListLoadmore}
                className={classes.loadmoreButton}>Loadmore</Button>:
              userListVisible < 20 &&
              <Button
                fullWidth
                onClick={this.handleUserListLoadmore}
                className={classes.loadmoreButton}>Loadmore</Button>
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