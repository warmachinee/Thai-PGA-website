import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

import blue from '@material-ui/core/colors/blue';

const palette = {
  appBar: blue['A700']
}

const styles = theme => ({
  appBar: {
    backgroundColor: palette.appBar
  },
  grow: {
    flexGrow: 1,
    marginLeft: 20
  },
});

class MenuAppBar extends React.Component {
  state = {
    anchorEl: null,
    auth: false,
    navOpacity: 1
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleMenuClose = () =>{
    this.setState({ anchorEl: null });
  }
  handleLogout = () =>{
    this.handleMenuClose()
    this.props.doUnAuthenticate()
  }
  handleAdminLogout = () =>{
    this.handleMenuClose()
    this.props.doAdminUnAuthenticate()
  }
  appBarScroll = () =>{
    if(window.scrollY > 0){
      this.setState({navOpacity: .6})
    }else{
      this.setState({navOpacity: 1})
    }
  }
  componentDidMount(){
    window.addEventListener('scroll',this.appBarScroll)
  }
  componentWillUnmount(){
    window.removeEventListener('scroll',this.appBarScroll)
  }
  render() {
    const { classes, modalOpen, modalClose, isAuthenticated, isAdminAuthenticated } = this.props;
    const { anchorEl, navOpacity } = this.state;
    const open = Boolean(anchorEl);
    return (
      <AppBar style={{opacity: navOpacity,transition: '.2s'}}>
        <Toolbar position="fixed" className={classes.appBar}>
          <Link to='/' style={{ textDecoration: 'none',color: 'white' }} className={classes.grow}>
            <Typography variant="h6" color="inherit">
              Thai-PGA
            </Typography>
          </Link>
          { !isAuthenticated?
            ( !isAdminAuthenticated ? <Button color="inherit" onClick={modalOpen}>Login</Button>:null )
            :null
          }
          { isAuthenticated ?(
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleMenu}
              >
                { isAuthenticated && (window.location.pathname === '/') ?
                  <Link to='/user' style={{ textDecoration: 'none',color: 'white' }}>
                    <MenuItem onClick={this.handleMenuClose}>MyAccount</MenuItem>
                  </Link>:
                  <Link to='/' style={{ textDecoration: 'none',color: 'white' }}>
                    <MenuItem onClick={this.handleMenuClose}>Home</MenuItem>
                  </Link>
                }
                <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
              </Menu>
            </div>
          ):null}
          { isAdminAuthenticated?(
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleMenu}
              >
                { isAdminAuthenticated && (window.location.pathname === '/') ?
                  <Link to='/user' style={{ textDecoration: 'none',color: 'white' }}>
                    <MenuItem onClick={this.handleMenuClose}>Admin</MenuItem>
                  </Link>:
                  <Link to='/' style={{ textDecoration: 'none',color: 'white' }}>
                    <MenuItem onClick={this.handleMenuClose}>Home</MenuItem>
                  </Link>
                }
                <MenuItem onClick={this.handleAdminLogout}>Log out</MenuItem>
              </Menu>
            </div>
          ):null}
        </Toolbar>
      </AppBar>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);
