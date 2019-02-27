import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl } from '../data/api'

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    marginTop: window.innerWidth > 600 ? 94: 86,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    maxWidth: 900,
    margin: 'auto'
  },
  contentGrid: {
    margin: 'auto',
    maxWidth: 700,
    marginTop: '1.25rem'
  }
});
function MatchDetail(props){
  const { classes, matchParams, data } = props;

  const mediaStyle = {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: data? `url(${data[matchParams].img})`: 'none',
    backgroundColor: '#ccc',
    height:
    (window.innerWidth > 500)? 300:
    (window.innerWidth > 450)? 250:
    (window.innerWidth > 320)? 200:150,
    margin: '1rem 0'
  }

  function ScoreBoardExpansion(props){
    const { data } = props

    function ScoreTable(props){
      const { data, index } = props
      const [ rf, refresh ] = useState(0)
      const rowStyle = {
        boxSizing: 'border-box',
        width: 36,
        paddingRight: 8,
        textAlign: 'right'
      }
      const moreThan600 = (
        <Table>
          <TableBody style={{display: 'flex',justifyContent: 'center'}}>
            {/*----------Label----------*/}
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} align="center" padding="none">{"IN"}</TableCell>
            </TableRow>
          </TableBody>
          {/*----------PAR----------*/}
          <TableBody style={{display: 'flex',justifyContent: 'center'}}>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} align="center" padding="none">{"IN"}</TableCell>
            </TableRow>
          </TableBody>
          {/*----------SCORE----------*/}
          <TableBody style={{display: 'flex',justifyContent: 'center'}}>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell style={{boxSizing: 'border-box', width: 28, padding: `${window.innerWidth*.01}px`}} align="center" padding="none">{"IN"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const lessThan600 = (
        <Table>
          {/*----------Label----------*/}
          <TableBody>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
          </TableBody>
          {/*----------PAR----------*/}
          <TableBody>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
          </TableBody>
          {/*----------SCORE----------*/}
          <TableBody>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

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
        <ExpansionPanel style={{margin: '4px 0'}} expanded>
          <ExpansionPanelSummary style={{padding: '0 8px',display: 'flex'}}>
            <div style={{ width: 150, paddingLeft: 8,overflow: 'hidden',fontSize: 14 }}>
              {data? data.full[index]:'Player'}{"  "}{data? data.last[index]:'Player'}
            </div>
            <div style={{flex: 1}}></div>
            <div style={rowStyle}>{data? data.in[index]:'OUT'}</div>
            <div style={rowStyle}>{data? data.out[index]:'IN'}</div>
            <div style={rowStyle}>{data? data.gross[index]:'TOT'}</div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{padding: '0 8px',display: 'flex'}}>
            { window.innerWidth > 600? moreThan600 : lessThan600 }
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    }
    return(
      <ExpansionPanel expanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Score board</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{padding: 8,flexDirection: 'column'}}>
          <ScoreTable />
          {data? data.userid.map( (d,i) =>
            <ScoreTable key={i} data={data} index={i}/>
          ):<ScoreTable />}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
  return(
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={4}>
        <Link to='/' style={{ textDecoration: 'none',marginRight: '2rem' }}>
          <IconButton>
            <ArrowBackIcon fontSize="large"/>
          </IconButton>
        </Link>
        <div className={classes.contentGrid}>
          <Typography variant="h5" component="h3">
            {data ? data[matchParams].matchname:'Match name'}
          </Typography>
          <Typography variant="subtitle2">
            {data ? data[matchParams].datematch:'data 01-01-2019'}
          </Typography>
          <Typography variant="subtitle2">
            {data ? data[matchParams].fieldname:'Fieldname'}
          </Typography>
          <div style={mediaStyle}></div>

          <ScoreBoardExpansion data={data ? data[matchParams]:null}/>
        </div>
      </Paper>
    </div>
  );
}

MatchDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MatchDetail);
