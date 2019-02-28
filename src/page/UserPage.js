import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

import TabsOverview from '../components/Tabs/TabsOverview'
import CardUserProfile from '../components/Card/CardUserProfile'

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
  tabs: {
    margin: 'auto',
    maxWidth: 500,
    marginTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
  }
});

class UserPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: 0,
    }
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes, theme, data } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={4}>
          <CardUserProfile data={data}/>
          <Paper className={classes.tabs}>
            <TabsOverview data={data}/>
          </Paper>
        </Paper>
      </div>
    );
  }
}

UserPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserPage);
