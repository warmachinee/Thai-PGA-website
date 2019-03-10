import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import green from '@material-ui/core/colors/green';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

class SnackBarAlert extends React.Component {

  render() {
    const { classes, open, onClose, autoHideDuration, message, variant } = this.props;
    const VariantIcon = {
      success: <CheckCircleIcon className={classNames(classes.icon, classes.iconVariant)} />,
      error: <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />,
    };
    return (
      <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={autoHideDuration}
          onClose={onClose}
        >
        <SnackbarContent
          className={classes[variant]}
          message={
            <span className={classes.message}>
              {VariantIcon[variant]}
              {message}
            </span>
          }
          action={[
            <IconButton
              color="inherit"
              className={classes.close}
              onClick={onClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

SnackBarAlert.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SnackBarAlert);
