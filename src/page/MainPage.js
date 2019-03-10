import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SlideShow from '../components/SlideShow'
import MatchList, { MatchListPaper } from '../components/MatchList'

const styles = {
  root: {
    marginTop: window.innerWidth > 600 ? 64: 56
  },
};
class MainPage extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <SlideShow
          autoPlay
          duration={5000}
          data={this.props.data}/>
        <MatchListPaper>
          <MatchList data={this.props.data}/>
        </MatchListPaper>
      </div>
    );
  }
}

MainPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainPage);
