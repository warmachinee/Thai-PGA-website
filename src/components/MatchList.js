import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CardMatch from './Card/CardMatch'

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import blue from '@material-ui/core/colors/blue';

const palette = {
  signInBtn: blue['A700'],
  text: blue[800]
}
const styles = theme => ({
  root: {
    margin: 'auto',
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    minWidth: 250,
  },
  grid: {
    display: 'grid',
  },
  title: {
    padding: '16px 56px',
  },
  progress: {
    margin: 'auto',
    marginLeft: 8
  },
});

function MatchList(props) {
  const { classes, data } = props;
  const [ rf, refresh ] = useState(0)
  const gridStyle = {
    gridTemplateColumns:
    (window.innerWidth > 1480)?'auto auto auto auto':
    (window.innerWidth > 1100)?'auto auto auto':
    (window.innerWidth > 780)?'auto auto':'auto',
  }
  const titleStyle = {
    margin: window.innerWidth > 330? '5%':'10%',
    textDecoration: 'none',
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
      <div style={{ display: 'flex'}}>
        <Link to='/match' style={titleStyle}>
          <Button variant="outlined" color="inherit" className={classes.title}>
            Match list
          </Button>
        </Link>
        { !data?
          <div className={classes.progress}>
            <CircularProgress style={{ color: palette.text}}/>
          </div>:null
        }
      </div>
      <div className={classes.grid} style={gridStyle}>
        { data ? data.map( (d,i) =>
          <CardMatch key={d.matchname} data={d} index={i}/>
        ):
          <CardMatch
            mediaStyle={{ backgroundSize: 'contain' }}
            data={{
              matchname: 'Matchname',
              datamatch: '01/01/2019',
              img: 'http://2.bp.blogspot.com/-V31y2Ef4Ad0/VZservQf70I/AAAAAAAAdu8/ErI--hbXwfE/s1600/OpenCamera1.png',
              fieldname: 'Fieldname'
            }}/>
        }
      </div>
    </div>
  );
}
export const MatchListPaper = withStyles(styles)(
  function (props){
    const { classes, data } = props;
    const [ rf, refresh ] = useState(0)

    function resizeEffect(){
      refresh(rf + 1)
    }
    useEffect(()=>{
      window.addEventListener('resize',resizeEffect)
      return ()=>{
        window.removeEventListener('resize',resizeEffect)
      }
    },[ window.innerWidth ])
    return(
      <Paper
        className={classes.paper}
        elevation={4}
        style={{ margin:
          (window.innerWidth > 1480)? 24:
          (window.innerWidth > 1100)? 20:
          (window.innerWidth > 780)? 16:0,
        }}>
        {props.children}
      </Paper>
    );
  }
)
MatchList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(MatchList);
