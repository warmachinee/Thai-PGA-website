import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

const palette = {
  signInBtn: blue['A700'],
  text: blue[900],
  subheader: blue[500]
}
const styles = {
  card: {
    width: '100%',
    maxWidth: 320,
    minWidth: 250,
    margin: 'auto',
  },
  media: {
    height: 150,
    backgroundColor: '#ccc'
  },
  detailBtn: {
    float: 'right'
  },
  title: {
    color: palette.text
  },
  subheader: {
    color: palette.subheader
  }
};

function CardMatch(props) {
  const { classes, data } = props;
  const [ rf, refresh ] = useState(0)
  const cardStyle = {
    marginTop: window.innerWidth > 330? '5%':'10%',
    marginBottom: window.innerWidth > 330? '5%':'10%',
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
    <Card className={classes.card} style={cardStyle}>
      <CardHeader
        title={data.matchname}
        subheader={data.datematch}/>
      <CardActionArea>
        <CardMedia
          style={{ ...props.mediaStyle }}
          className={classes.media}
          image={data.img}
          title="Contemplative Reptile"/>
        <CardContent>
          <Typography gutterBottom variant="h6">
            {data.fieldname}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.detailBtn}>
        <Link to={`/match/${props.index}`} style={{ textDecoration: 'none'}}>
          <Button size="small" color="primary">Detail</Button>
        </Link>
      </CardActions>
    </Card>
  );
}

CardMatch.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(CardMatch);
