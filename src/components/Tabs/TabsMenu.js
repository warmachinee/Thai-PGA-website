import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { fetchPostUrl } from '../../data/api'

import SnackBarAlert from '../SnackBarAlert'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import blue from '@material-ui/core/colors/blue';
import purple from '@material-ui/core/colors/purple';

const palette = {
  signInBtn: blue['A700'],
  text: blue[800],
  adminBtn: purple[500]
}
const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing.unit,
    right: theme.spacing.unit,
  },
  signInBtn: {
    marginTop: '2rem',
    marginBottom: '1rem',
    width: '100%',
    backgroundColor: palette.signInBtn
  },
  signInTitle: {
    textAlign: 'center',
    marginTop: '10%',
    marginBottom: '5%',
    color: palette.text
  },
  tabsText: {
    color: palette.text
  },
  controls: {
    width: '100%',
    display: 'flex',
    marginBottom: '2rem'
  },
  adminBtn: {
    marginRight: '5%',
    color: palette.adminBtn
  },
  adminConfirmBtn: {
    color: palette.adminBtn,
    borderColor: palette.adminBtn
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500],
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: purple[500],
    },
  },
  notchedOutline: {},
});

class TabsMenu extends React.Component {
  state = {
    value: 0,
    username: null,
    password: null,
    adminUsername: null,
    adminPassword: null,
    adminModalState: false,
    snackBarState: false,
    snackBarMessage: null,
    snackBarVariant: null
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  handleAdminSigninModal = () => {
    this.setState({ adminModalState: true });
  };
  handleAdminSigninModalClose = () => {
    this.setState({ adminModalState: false });
  };
  handleAdminSignin = async () =>{
    const data = await fetchPostUrl('https://thai-pga.com/login',{
      username: this.state.adminUsername,
      password: this.state.adminPassword
    })
    if(data){
      if(data.status === 'success'){
        if(data.type === 'admin'){
          this.setState({
            snackBarState: true,
            snackBarMessage: data.status,
            snackBarVariant: 'success'
          })
          this.handleAdminSigninModalClose()
          this.props.onClose()
          this.props.doAdminAuthenticate(data)
        }else{
          this.setState({
            snackBarState: true,
            snackBarMessage: 'Please use admin account',
            snackBarVariant: 'error'
          })
        }
      }else{
        this.setState({
          snackBarState: true,
          snackBarMessage: data.status,
          snackBarVariant: 'error'
        })
      }
    }else{
      this.setState({
        snackBarState: true,
        snackBarMessage: 'Something wrong please check',
        snackBarVariant: 'error'
      })
    }
  }
  handleOnKeyPress = (e) =>{
    if(e.key === 'Enter'){
      this.handleSignIn()
    }
  }
  handleOnKeyPressAdmin = (e) =>{
    if(e.key === 'Enter'){
      this.handleAdminSignin()
    }
  }
  handleSignIn = async () =>{
    const data = await fetchPostUrl('https://thai-pga.com/login',{
      username: this.state.username,
      password: this.state.password
    })
    if(data){
      if(data.status === 'success'){
        if(data.type === 'user'){
          this.props.onClose()
          this.props.doAuthenticate(data)
        }else{
          this.props.handleLoginStatus('Please use nomal account')
        }
      }else{
        this.props.handleLoginStatus(data.status)
      }
    }else{
      this.props.handleLoginStatus('Something wrong please check')
    }
  }
  render() {
    const { classes, theme, label, component } = this.props;
    const { adminModalState, snackBarState, snackBarMessage, snackBarVariant } = this.state
    const AdminSignin = (
      <Dialog
          open={adminModalState}
          onClose={this.handleAdminSigninModalClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>
            <div style={{ color: purple[500] }}>Admin</div>
          </DialogTitle>
          <DialogContent style={{ paddingBottom: 0 }}>
            <TextField
              autoFocus
              label="Username"
              type="email"
              autoComplete="email"
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              }}
              InputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              onChange={(e)=>this.setState({adminUsername: e.target.value})}
              onKeyPress={(e)=>this.handleOnKeyPressAdmin(e)}/>
          </DialogContent>
          <DialogContent>
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              }}
              InputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              onChange={(e)=>this.setState({adminPassword: e.target.value})}
              onKeyPress={(e)=>this.handleOnKeyPressAdmin(e)}/>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleAdminSigninModalClose}
              className={classes.adminBtn}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={this.handleAdminSignin}
              className={classes.adminConfirmBtn}>
              Confirm
            </Button>
          </DialogActions>
          <SnackBarAlert
            variant={snackBarVariant}
            autoHideDuration={2000}
            open={snackBarState}
            onClose={()=>this.setState({ snackBarState: false })}
            message={snackBarMessage}/>
        </Dialog>
    )
    const SignIn = (
      <div>
        <IconButton className={classes.closeIcon} onClick={this.props.onClose}>
          <CloseIcon fontSize="large"/>
        </IconButton>
        <Typography className={classes.signInTitle} variant="h4">
          Sign in
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            autoFocus
            label="Email or Username"
            className={classes.textField}
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            onChange={(e)=>this.setState({username: e.target.value})}
            onKeyPress={(e)=>this.handleOnKeyPress(e)}
            fullWidth/>
          <TextField
            label="Password"
            className={classes.textField}
            type="password"
            autoComplete="current-password"
            margin="normal"
            variant="outlined"
            onChange={(e)=>this.setState({password: e.target.value})}
            onKeyPress={(e)=>this.handleOnKeyPress(e)}
            fullWidth/>
          <Fab variant="extended" color="primary" aria-label="Add"
            onClick={this.handleSignIn}
            className={classes.signInBtn}>
            Sign in
          </Fab>
          <div className={classes.controls}>
            <div style={{ flex: 1 }}></div>
            <Button
              color="primary"
              className={classes.adminBtn}
              onClick={this.handleAdminSigninModal}>
              Admin
            </Button>
          </div>
        </form>
      </div>
    );
    return (
      <div className={classes.root}>
        { AdminSignin }
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab className={classes.tabsText} label="Sign in" />
            <Tab className={classes.tabsText} label="Register ( Soon... )" disabled/>
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <div dir={theme.direction} style={{ padding: 8 * 3 }}>
            { SignIn }
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

TabsMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TabsMenu);
