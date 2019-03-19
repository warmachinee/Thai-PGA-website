import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

import { fetchUrl, fetchPostUrl } from '../../data/api'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  itemList: {
    overflow: 'auto',
    margin: theme.spacing.unit * 2,
    boxSizing: 'border-box',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
});

class TabsEditPlayoff extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleEditPlayoff = (playoff, classno) =>{
    this.fetchEditPlayoff(playoff, classno)
  }

  async fetchEditPlayoff(playoff, classno){
    const data = await fetchPostUrl('https://www.tofftime.com/api/matcheditplayoff',{
      userid: parseInt(this.props.adminData.id),
      matchid: this.props.selectedMatch.matchid,
      playoff: playoff,
      classno: classno,
    })
    if(data.status === 'success'){
      this.handleLoadUserMatch()
    }else{
      this.props.handleSnackBar(true, data.status, 'error')
    }
  }
  async handleLoadUserMatch(){
    const user = await fetchPostUrl('https://tofftime.com/api/loadusermatch',{
      matchid: this.props.selectedMatch.matchid
    })
    let tempData = []
    let tempClass = []
    let tempPlayoffData = []
    let tempUserMatchClassname = []
    for(var i = 0;i < user.userid.length;i++){
      tempData.push({
        index: i,
        userid: user.userid[i],
        fullname: user.fullname[i],
        lastname: user.lastname[i],
        display: user.display[i],
        score: user.score[i],
        in: user.in[i],
        out: user.out[i],
        gross: user.gross[i],
        par: user.par[i]
      })
    }
    for(var i = 0;i < user.classname.length;i++){
      tempClass.push(user.classname[i])
    }
    for(var i = 0;i < user.fullplayoff.length;i++){
      tempPlayoffData.push({
        fullname: user.fullplayoff[i],
        lastname: user.lastplayoff[i]
      })
    }
    for(var i = 0;i < user.classname.length + 1;i++){
      if(i === 0){
        tempUserMatchClassname.push('-')
      }else{
        tempUserMatchClassname.push(user.classname[i-1])
      }
    }
    this.props.afterAddPlayer( tempData, tempUserMatchClassname, tempClass, user.playoff, tempPlayoffData )
  }
  render() {
    const { classes, theme, editPlayoffState, playOffIndex, playOffData, userMatchClassname } = this.props;
    const { playoff } = this.state
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            { userMatchClassname &&
              userMatchClassname.map((d, i)=>
                i && <Tab label={d} />
              )
            }
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          { playOffData &&
            playOffData.map((d,i)=>
            <div dir={theme.direction}>
              <List className={classes.itemList}>
                { d.fullname.map((user, index)=>
                  <ListItem
                    button={editPlayoffState}
                    style={{ height: 56 }}
                    onClick={()=>this.handleEditPlayoff( index + 1, i + 1 )}>
                    { ( index + 1 === playOffIndex[i])?
                      <CheckCircleIcon />:
                      <div style={{ width: 24 }}></div>
                    }
                    <ListItemText
                      primary={user}/>
                    <ListItemText
                      primary={d.lastname[index]} />
                    <ListItemSecondaryAction>
                      { editPlayoffState &&
                        <Checkbox
                          checked={( index + 1 === playOffIndex[i])}
                          />
                      }
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            </div>
            )
          }
        </SwipeableViews>
      </div>
    );
  }
}

TabsEditPlayoff.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TabsEditPlayoff);
