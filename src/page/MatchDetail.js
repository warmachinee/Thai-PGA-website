import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl } from '../data/api'

import MatchList from '../components/MatchList'
import MatchRegistrationForm from '../components/MatchRegistrationForm'

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

import blue from '@material-ui/core/colors/blue';
import indigo from '@material-ui/core/colors/indigo'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'

const palette = {
  holeBG: indigo[900],
  parBG: blue['A100'],
  parTitle: blue['A200'],
  scoreBG: grey[100],
  scoreTitle: '#ccc'
}

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
  },
  cellStyle: {
    boxSizing: 'border-box',
    width: 28,
    maxWidth: 28,
    padding: `17px 9px`,
    border: 'none'
  },
  chip: {

  },
});
function MatchDetail(props){
  const { classes, matchParams, urlParams, data } = props;
  const [ dataGrouped, setDataGrouped ] = useState(null)
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
    const { data, rawData } = props
    const [ rf, refresh ] = useState(0)

    const rowLabelStyle = {
      boxSizing: 'border-box',
      paddingRight: 8,
      textAlign: 'right',
      fontSize: window.innerWidth > 600 ? 14:12,
      margin: 'auto',
      width: window.innerWidth > 600 ? 36:28
    }
    function ScoreTable(props){
      const { data, rawData, index } = props
      const [ rf, refresh ] = useState(0)
      const rowStyle = {
        boxSizing: 'border-box',
        paddingRight: 8,
        textAlign: 'right',
        fontSize: window.innerWidth > 600 ? 14:12,
        margin: 'auto',
        width: window.innerWidth > 600 ? 36:28
      }
      function fieldscoreSum(){
        let IN = 0;
        let OUT = 0;
        if(rawData){
          for(var i = 0;i < rawData[matchParams].fieldscore.length;i++){
            if(i < 9){
              OUT += rawData[matchParams].fieldscore[i]
            }else{
              IN += rawData[matchParams].fieldscore[i]
            }
          }
        }
        return { OUT, IN }
      }

      function ScoreStyle(type, score = null, fieldscore = null){
        let over, under;
        if(type === '>'){
          over = {
            TableCell: {
              padding: '10px 1.5px'
            },
            div: {
              border: `1.5px solid ${grey[700]}`, padding: '20% 0',
              backgroundColor:
              ( score - fieldscore ) > 1? red[400]:amber[400]
            }
          }
          under = {
            TableCell: {
              padding: '10px 1.5px'
            },
            div: {
              border: `1.5px solid ${grey[700]}`, padding: '20% 0', borderRadius: '50%',
              backgroundColor:
              ( fieldscore - score ) > 1? green[900]:green['A700'],
              color:
              ( fieldscore - score ) > 1? 'white':'black',
            }
          }
        }
        else{
          over = {
            TableCell: {
              padding: `0 ${window.innerWidth > 500 ? '1.5%': '1.25%'}`
            },
            div: {
              border: `1.5px solid ${grey[700]}`, padding: '4px 0',
              backgroundColor:
              ( score - fieldscore ) > 1? red[400]:amber[400]
            }
          }
          under = {
            TableCell: {
              padding: `0 ${window.innerWidth > 500 ? '2%': '1%'}`
            },
            div: {
              border: `1.5px solid ${grey[700]}`,
              padding: `${window.innerWidth > 500 ? 6:4}px 0`,
              borderRadius: '50%',
              backgroundColor:
              ( fieldscore - score ) > 1? green[900]:green['A700'],
              color:
              ( fieldscore - score ) > 1? 'white':'black',
            }
          }
        }

        return { over, under }
      }

      const moreThan670 = (
        <Table>
          {/*----------Label----------*/}
          <TableBody style={{display: 'flex', backgroundColor: palette.holeBG }}>
            <div style={{ flex: 1}}></div>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell style={{ color: 'white' }} className={classes.cellStyle} key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold', color: 'white' }} className={classes.cellStyle} align="center" padding="none">{'OUT'}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell style={{ color: 'white' }} className={classes.cellStyle} key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold', color: 'white' }} className={classes.cellStyle} align="center" padding="none">{'IN'}</TableCell>
            </TableRow>
            <div style={{ flex: 1}}></div>
          </TableBody>
          {/*----------PAR----------*/}
          <TableBody style={{display: 'flex', backgroundColor: palette.parBG }}>
            <div style={{ flex: 1}}></div>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell className={classes.cellStyle} key={d} align="center" padding="none">{rawData ? rawData[matchParams].fieldscore[i]:d}</TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold' }} className={classes.cellStyle} align="center" padding="none">{fieldscoreSum().OUT}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell className={classes.cellStyle} key={d+9} align="center" padding="none">{rawData ? rawData[matchParams].fieldscore[i+9]:d+9}</TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold' }} className={classes.cellStyle} align="center" padding="none">{fieldscoreSum().IN}</TableCell>
            </TableRow>
            <div style={{ flex: 1}}></div>
          </TableBody>
          {/*----------SCORE----------*/}
          <TableBody style={{display: 'flex', backgroundColor: palette.scoreBG }}>
            <div style={{ flex: 1}}></div>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell className={classes.cellStyle} key={d} align="center" padding="none" style={
                  data?(
                    data[index].holescore[i] > rawData[matchParams].fieldscore[i]?
                    ScoreStyle('>',data[index].holescore[i]).over.TableCell:
                    data[index].holescore[i] < rawData[matchParams].fieldscore[i]?
                    ScoreStyle('>',data[index].holescore[i]).under.TableCell:null
                  ):null
                }>
                  <div style={
                    data?(
                      data[index].holescore[i] > rawData[matchParams].fieldscore[i]?
                      ScoreStyle('>', data[index].holescore[i], rawData[matchParams].fieldscore[i]).over.div:
                      data[index].holescore[i] < rawData[matchParams].fieldscore[i]?
                      ScoreStyle('>',data[index].holescore[i], rawData[matchParams].fieldscore[i]).under.div:null
                    ):null
                  }>
                    {data? data[index].holescore[i]:d }
                  </div>
                </TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold' }} className={classes.cellStyle} align="center" padding="none">{data? data[index].in:'OUT'}</TableCell>
            </TableRow>
            <TableRow>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell className={classes.cellStyle} key={d+9} align="center" padding="none" style={
                  data?(
                    data[index].holescore[i+9] > rawData[matchParams].fieldscore[i+9]?
                    ScoreStyle('>',data[index].holescore[i]).over.TableCell:
                    data[index].holescore[i+9] < rawData[matchParams].fieldscore[i+9]?
                    ScoreStyle('>',data[index].holescore[i]).under.TableCell:null
                  ):null
                }>
                  <div style={
                    data?(
                      data[index].holescore[i+9] > rawData[matchParams].fieldscore[i+9]?
                      ScoreStyle('>', data[index].holescore[i+9], rawData[matchParams].fieldscore[i+9]).over.div:
                      data[index].holescore[i+9] < rawData[matchParams].fieldscore[i+9]?
                      ScoreStyle('>', data[index].holescore[i+9], rawData[matchParams].fieldscore[i+9]).under.div:null
                    ):null
                  }>
                    {data? data[index].holescore[i+9]:d+9}
                  </div>
                </TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold' }} className={classes.cellStyle} align="center" padding="none">{data? data[index].out:'IN'}</TableCell>
            </TableRow>
            <div style={{ flex: 1}}></div>
          </TableBody>
        </Table>
      )
      const lessThan670 = (
        <Table>
          {/*---------- HOLE 0 - 9 ----------*/}
          <TableBody>
            <TableRow style={{ backgroundColor: palette.holeBG }}>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{ border: 'none', color: 'white' }} key={d} align="center" padding="none">{d}</TableCell>
              )}
              <TableCell style={{ border: 'none', color: 'white', fontWeight: 'bold'  }} align="center" padding="none">{"OUT"}</TableCell>
            </TableRow>
            <TableRow style={{ backgroundColor: palette.parBG }}>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell style={{ border: 'none' }} key={i} align="center" padding="none">{rawData ? rawData[matchParams].fieldscore[i]:d}</TableCell>
              )}
              <TableCell style={{ border: 'none', fontWeight: 'bold' }} align="center" padding="none">{fieldscoreSum().OUT}</TableCell>
            </TableRow>
            <TableRow style={{ backgroundColor: palette.scoreBG }}>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell key={d} align="center" padding="none"
                  style={
                    data?(
                      data[index].holescore[i] > rawData[matchParams].fieldscore[i]?
                      ScoreStyle('<',data[index].holescore[i]).over.TableCell:
                      data[index].holescore[i] < rawData[matchParams].fieldscore[i]?
                      ScoreStyle('<',data[index].holescore[i]).under.TableCell:null
                    ):null
                  }>
                  <div style={
                    data?(
                      data[index].holescore[i] > rawData[matchParams].fieldscore[i]?
                      ScoreStyle('<', data[index].holescore[i], rawData[matchParams].fieldscore[i]).over.div:
                      data[index].holescore[i] < rawData[matchParams].fieldscore[i]?
                      ScoreStyle('<', data[index].holescore[i], rawData[matchParams].fieldscore[i]).under.div:null
                    ):null
                  }>
                    {data? data[index].holescore[i]:d}
                  </div>
                </TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold' }} align="center" padding="none">{data? data[index].in:'OUT'}</TableCell>
            </TableRow>
          </TableBody>
          {/*---------- HOLE 10 - 18 ----------*/}
          <TableBody>
            <TableRow style={{ backgroundColor: palette.holeBG }}>
              {[1,2,3,4,5,6,7,8,9].map( d=>
                <TableCell style={{ border: 'none', color: 'white'  }} key={d+9} align="center" padding="none">{d+9}</TableCell>
              )}
              <TableCell style={{ border: 'none', color: 'white', fontWeight: 'bold'  }} align="center" padding="none">{"IN"}</TableCell>
            </TableRow>
            <TableRow style={{ backgroundColor: palette.parBG }}>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell key={i} align="center" padding="none">{rawData ? rawData[matchParams].fieldscore[i+9]:d+9}</TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold' }} align="center" padding="none">{fieldscoreSum().IN}</TableCell>
            </TableRow>
            <TableRow style={{ backgroundColor: palette.scoreBG }}>
              {[1,2,3,4,5,6,7,8,9].map((d,i)=>
                <TableCell key={d+9} align="center" padding="none" style={
                  data?(
                    data[index].holescore[i+9] > rawData[matchParams].fieldscore[i+9]?
                    ScoreStyle('<',data[index].holescore[i]).over.TableCell:
                    data[index].holescore[i+9] < rawData[matchParams].fieldscore[i+9]?
                    ScoreStyle('<',data[index].holescore[i]).under.TableCell:null
                  ):null
                }>
                  <div style={
                    data?(
                      data[index].holescore[i+9] > rawData[matchParams].fieldscore[i+9]?
                      ScoreStyle('<', data[index].holescore[i+9], rawData[matchParams].fieldscore[i+9]).over.div:
                      data[index].holescore[i+9] < rawData[matchParams].fieldscore[i+9]?
                      ScoreStyle('<', data[index].holescore[i+9], rawData[matchParams].fieldscore[i+9]).under.div:null
                    ):null
                  }>
                    {data? data[index].holescore[i+9]:d+9}
                  </div>
                </TableCell>
              )}
              <TableCell style={{ fontWeight: 'bold' }} align="center" padding="none">{data? data[index].out:'IN'}</TableCell>
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
        <ExpansionPanel style={{margin: '4px 0'}}>
          <ExpansionPanelSummary style={{padding: '0 8px',display: 'flex'}}>
            <div style={{
                textAlign: 'right',
                paddingRight: 8,
                fontSize: window.innerWidth > 600 ? 14:12,
                margin: 'auto',
                width: window.innerWidth > 600 ? 36:28
            }}>{data? data[index].rank:'Rank'}</div>
            <div style={{ width:
                window.innerWidth>750?400:
                window.innerWidth>600?300:
                window.innerWidth>450?250:
                window.innerWidth>320?150:100,paddingLeft: 8,
                textOverflow: 'ellipsis', overflow: 'hidden',whiteSpace: 'nowrap',
                fontSize: window.innerWidth > 600 ? 14:12,
              }}>
              {data? data[index].full:'Player'}{"  "}{data? data[index].last:'Player'}
            </div>
            <div style={{flex: 1}}></div>
            <div style={rowStyle}>{data? data[index].in:'OUT'}</div>
            <div style={rowStyle}>{data? data[index].out:'IN'}</div>
            <div style={rowStyle}>{data? data[index].gross:'TOT'}</div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{padding: '0 8px',display: 'flex'}}>
            { window.innerWidth > 670? moreThan670 : lessThan670 }
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <div style={{
                fontSize: window.innerWidth > 500? 16:12,
                border: `1.5px solid ${grey[700]}`, padding: window.innerWidth > 500? '8px 4px':'8px 4px',
                marginRight: 4
              }}>Under</div>
            <div style={{
                fontSize: window.innerWidth > 500? 16:12,
                border: `1.5px solid ${grey[700]}`, padding: window.innerWidth > 500? '10px 2px':'10px 4px',
                borderRadius: '50%'
              }}>Over</div>
            <div style={{ flex: 1}}></div>
            <Chip
              label="Hole"
              className={classes.chip}
              component="a"
              style={{
                backgroundColor: palette.holeBG, color: 'white', fontWeight: '500', letterSpacing: 1,
                fontSize: window.innerWidth > 500? 16:12, padding: 4
              }}/>
            <Chip
              label="Par"
              className={classes.chip}
              component="a"
              style={{
                backgroundColor: palette.parBG, fontWeight: '500', letterSpacing: 1,
                fontSize: window.innerWidth > 500? 16:12, padding: 4
              }}/>
            <Chip
              label="Score"
              className={classes.chip}
              component="a"
              style={{
                backgroundColor: palette.scoreBG, fontWeight: '500', letterSpacing: 1,
                fontSize: window.innerWidth > 500? 16:12, padding: 4,
                border: '1px solid black'
              }}/>
          </ExpansionPanelActions>
        </ExpansionPanel>
      )
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
    return(
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {data? data[0].departname: 'none'}{" "}
            ( {data?data.length:0} {data? (data.length > 1?'Players':'Player'):'Player'})
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{padding: 8,flexDirection: 'column'}}>
          <ExpansionPanel
            className="sticky"
            style={{margin: '4px 0',
              top: window.innerWidth > 600 ? 64: 56,
              paddingLeft: 8,
              zIndex: 10,
              backgroundColor: 'black',
              color: 'white'
            }}>
            <ExpansionPanelSummary style={{padding: '0 8px',display: 'flex'}}>
              <div style={{
                  textAlign: 'right',
                  fontSize: window.innerWidth > 600 ? 14:12,
                  margin: 'auto',
                  width: window.innerWidth > 600 ? 36:28
              }}>{'Rank'}</div>
              <div style={{ width:
                  window.innerWidth > 750 ? 400:
                  window.innerWidth > 600 ? 300:
                  window.innerWidth > 450 ? 250:
                  window.innerWidth > 320 ? 150:100, paddingLeft: 8,
                  textOverflow: 'ellipsis', overflow: 'hidden',whiteSpace: 'nowrap',
                  fontSize: window.innerWidth > 600 ? 14:12,
                  margin: 'auto'  }}>
                {'Player name'}
              </div>
              <div style={{flex: 1}}></div>
              <div style={rowLabelStyle}>{'OUT'}</div>
              <div style={rowLabelStyle}>{'IN'}</div>
              <div style={rowLabelStyle}>{'TOT'}</div>
            </ExpansionPanelSummary>
          </ExpansionPanel>
          {data? data.map( (d,i) =>
            <ScoreTable key={i} data={data} index={i} rawData={rawData} />
          ):<ScoreTable />}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );

  }
  useEffect(()=>{
    let tempData = []
    if(data){
      for(var i = 0;i < data[matchParams].departnum;i++){
        let obj = []
        for(var j = 0;j < data[matchParams].userid.length;j++){
          obj.push({
            departno: data[matchParams].departno[j],
            departname: data[matchParams].departname ? data[matchParams].departname[j]: 'none',
            full: data[matchParams].full[j],
            last: data[matchParams].last[j],
            in: data[matchParams].in ? data[matchParams].in[j]: 0,
            out: data[matchParams].out ? data[matchParams].out[j]: 0,
            gross: data[matchParams].gross ? data[matchParams].gross[j]: 0,
            rank: data[matchParams].rank ? data[matchParams].rank[j]: 0,
            holescore:
            data[matchParams].holescore ?
            data[matchParams].holescore[j]: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          })
        }
        const filtered = obj.filter((d)=>{
          return d.departno === i+1
        })
        tempData.push(filtered)
      }
      setDataGrouped(tempData)
    }
  },[ ])

  const Main = ({ match }) =>{
    return(
      <Paper className={classes.paper} elevation={4}>
        <IconButton onClick={()=>window.history.go(-1)}>
          <ArrowBackIcon fontSize="large"/>
        </IconButton>
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
          <Typography variant="h6" style={{ marginBottom: '1rem'}}>Score board</Typography>
          { dataGrouped ?
            dataGrouped.map( d =>
              <ScoreBoardExpansion data={d} rawData={data}/>
            ):/*<Typography variant="h5">Loading ...</Typography>*/<ScoreBoardExpansion />
          }
        </div>
      </Paper>
    );
  }

  const Registration = ({ match }) =>{
    return(
      <Paper className={classes.paper} elevation={4}>
        <IconButton onClick={()=>window.history.go(-1)}>
          <ArrowBackIcon fontSize="large"/>
        </IconButton>
        <div className={classes.contentGrid}>
          <Typography variant="h5" component="h3">
            Registration
          </Typography>
          <MatchRegistrationForm />
        </div>
      </Paper>
    )
  }

  return(
    <div className={classes.root}>

      <Route exact path={`${urlParams.path}/`} component={Main} />
      <Route path={`${urlParams.path}/registration`} component={Registration} />
    </div>
  );
}

MatchDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MatchDetail);
