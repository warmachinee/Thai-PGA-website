import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '../components/AppBar'
import TabsMenu from '../components/Tabs/TabsMenu'
import SnackBarAlert from '../components/SnackBarAlert'

import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {

  },
  dialog: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none',
    maxWidth: 500,
    width: '100%',
    minWidth: 300
  }
});

const Dialog = withStyles(styles)(
  class extends React.Component<Props> {
    state = {
      snackBarState: false,
      snackBarMessage: null,
      snackBarVariant: null
    }
    handleLoginStatus = (d) =>{
      if(d){
        if(d === 'success'){

        }
        else{
          this.setState({
            snackBarState: true,
            snackBarMessage: d,
            snackBarVariant: 'error'
          })
        }
      }
    }
    render() {
      const { classes, open, close, modalState } = this.props
      const { snackBarState, snackBarMessage, snackBarVariant } = this.state
      return (
        <Modal
          open={modalState}
          onClose={close}>
          <div>
            <div className={classes.dialog}>
              <TabsMenu
                onClose={close}
                handleLoginStatus={this.handleLoginStatus}
                doAuthenticate={this.props.doAuthenticate}
                doAdminAuthenticate={this.props.doAdminAuthenticate}/>
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
);
class Header extends Component {
  state = {
    modalState: false
  }
  handleModal = () =>{
    this.setState({ modalState: true });
  }
  handleModalClose = () => {
    this.setState({ modalState: false });
  };

  render() {
    const { classes, isAuthenticated, isAdminAuthenticated } = this.props;
    const { modalState } = this.state;
    return (
      <div className={classes.root}>
        <AppBar
          isAuthenticated={isAuthenticated}
          isAdminAuthenticated={isAdminAuthenticated}
          doUnAuthenticate={this.props.doUnAuthenticate}
          doAdminUnAuthenticate={this.props.doAdminUnAuthenticate}
          modalOpen={this.handleModal}
          modalClose={this.handleModalClose}/>
        <Dialog
          doAuthenticate={this.props.doAuthenticate}
          doAdminAuthenticate={this.props.doAdminAuthenticate}
          modalState={modalState}
          close={this.handleModalClose}/>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
