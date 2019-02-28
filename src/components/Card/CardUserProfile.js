import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  card: {
    display: 'flex',
    margin: 'auto',
    maxWidth: 500,
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    margin: 'auto'
  },
  cover: {
    margin: 'auto'
  },
});

function CardUserProfile(props) {
  const { classes, theme, data } = props;
  const [ rf, refresh ] = useState(0)
  function cardMedia(){
    let height, width, flexDirection;
    if(window.innerWidth > 450){
      height = 200
      width = 250
      flexDirection = 'row'
    }else{
      height = 200
      width = 250
      flexDirection = 'column'
    }
    return { height, width, flexDirection }
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
    <Card className={classes.card} style={{ flexDirection: cardMedia().flexDirection }}>
      <CardMedia
        className={classes.cover}
        style={{ height: cardMedia().height, width: cardMedia().width }}
        image="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-id-512.png"
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {data ? data.fullname + " " + data.lastname:'Fullname Lastname'}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {data ? data.matchid.length:'none'} match played
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}

CardUserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CardUserProfile);
