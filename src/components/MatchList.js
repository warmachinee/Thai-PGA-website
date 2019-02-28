import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CardMatch from './Card/CardMatch'

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import blue from '@material-ui/core/colors/blue';

const palette = {
  signInBtn: blue['A700'],
  text: blue[800]
}
const styles = {
  root: {

  },
  grid: {
    display: 'grid',
  },
  title: {
    padding: '8px 40px'
  }
};

function MatchList(props) {
  const { classes, data } = props;
  const [ rf, refresh ] = useState(0)
  const gridStyle = {
    gridTemplateColumns:
    (window.innerWidth > 1480)?'auto auto auto auto':
    (window.innerWidth > 1100)?'auto auto auto':
    (window.innerWidth > 736)?'auto auto':'auto',
  }
  const titleStyle = {
    margin: window.innerWidth > 330? '5%':'10%',
    fontSize: '1.25rem',
    color: palette.text
  }

  function resizeEffect(){
    refresh(rf + 1)
  }

  useEffect(()=>{
    window.addEventListener('resize',resizeEffect)
    return ()=>{
      window.removeEventListener('resize',resizeEffect)
    }
  },[ window.innerWidth ])

  return (
    <div className={classes.root}>
      <Button variant="outlined" color="inherit" className={classes.title} style={titleStyle}>
        Match list
      </Button>
      <div className={classes.grid} style={gridStyle}>

        { data ? data.map( (d,i) =>
          <CardMatch key={d.matchname} data={d} index={i}/>
        ):<Typography className={classes.signInTitle} variant="h4">
            Loading ...
          </Typography>
        }
      </div>
    </div>
  );
}

MatchList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(MatchList);
