import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    marginTop: window.innerWidth > 600 ? 64: 56
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    maxWidth: 700,
    margin: 'auto'
  },
});

class AdminPage extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const { classes, theme, data } = this.props;
    console.log(data);
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={4}>
          This is AdminPage
        </Paper>
      </div>
    );
  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminPage);
