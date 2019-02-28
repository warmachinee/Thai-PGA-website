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

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';

import blue from '@material-ui/core/colors/blue';

const palette = {
  signInBtn: blue['A700'],
  text: blue[800]
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
  signInBtn: {
    marginTop: '2rem',
    marginBottom: '2rem',
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
  }
});

class TabsMenu extends React.Component {
  state = {
    value: 0,
    username: null,
    password: null
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  handleSignIn = async () =>{
    const data = await fetchPostUrl('https://thai-pga.com/login',{
      username: this.state.username,
      password: this.state.password
    })
    this.props.onClose()
    this.props.doAuthenticate(data)
  }
  render() {
    const { classes, theme, label, component } = this.props;
    const SignIn = (
      <div>
        <Typography className={classes.signInTitle} variant="h4">
          Sign in
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="outlined-email-input"
            label="Email or Username"
            className={classes.textField}
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            onChange={(e)=>this.setState({username: e.target.value})}
            style={{width: '100%'}}/>
          <TextField
            id="outlined-password-input"
            label="Password"
            className={classes.textField}
            type="password"
            autoComplete="current-password"
            margin="normal"
            variant="outlined"
            onChange={(e)=>this.setState({password: e.target.value})}
            style={{width: '100%'}}/>
          <Link
            style={{ textDecoration: 'none', width: '100%',
              marginLeft: theme.spacing.unit * 4,
              marginRight: theme.spacing.unit * 4,
            }}
            to='/user'>
            <Fab variant="extended" color="primary" aria-label="Add"
              onClick={this.handleSignIn}
              className={classes.signInBtn}>
              Sign in
            </Fab>
          </Link>
        </form>
      </div>
    );
    return (
      <div className={classes.root}>
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
