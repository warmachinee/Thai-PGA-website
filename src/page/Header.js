import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '../components/AppBar'
import TabsMenu from '../components/TabsMenu'

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
    render() {
      const { classes, open, close, modalState } = this.props
      return (
        <Modal
          open={modalState}
          onClose={close}>
          <div className={classes.dialog}>
            <TabsMenu />
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
    const { classes } = this.props;
    const { modalState } = this.state;
    return (
      <div className={classes.root}>
        <AppBar
          modalOpen={this.handleModal}
          modalClose={this.handleModalClose}/>
        <Dialog
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
