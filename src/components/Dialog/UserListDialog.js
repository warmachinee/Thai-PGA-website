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

import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';

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
    userListVisible: 10
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
  async fetchAddPlayer(player){
    const data = await fetchPostUrl('https://thai-pga.com/api/matchadduser',{
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
  async handleLoadUserMatch(matchid){
    const user = await fetchPostUrl('https://thai-pga.com/api/loadusermatch',{
      matchid: parseInt(this.props.selectedMatch.matchid)
    })
    let tempData = []
    let tempClass = []
    for(var i = 0;i < user.userid.length;i++){
      tempData.push({
        index: i,
        userid: user.userid[i],
        fullname: user.fullname[i],
        lastname: user.lastname[i]
      })
    }
    for(var i = 0;i < user.classname.length;i++){
      tempClass.push(user.classname[i])
    }
    this.props.afterAddPlayer( tempData, user.classname, tempClass )
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
    const { userListVisible, searchUser, snackBarState, snackBarMessage, snackBarVariant } = this.state
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
            { userListData ?
              userListVisible < userListData.length &&
              <Button
                fullWidth
                onClick={this.handleUserListLoadmore}
                className={classes.loadmoreButton}>Loadmore</Button>:null
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

UserListDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserListDialog);
