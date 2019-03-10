import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  arrowColor: {
    color: 'white',
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 10,
  }
};

function SlideShowBody(props){
  const { classes, autoPlay, duration, data } = props;
  const slideImageLength = data? data.length : 5
  const [ itemIndex, setItemIndex ] = useState(0)
  const [ intervalId, setIntervalId ] = useState(null)
  const [ rf, refresh ] = useState(0)

  function SliderSize(){
    let width;
    let height;
    if(window.innerWidth < window.innerHeight){
      //Protrait
      height = window.innerHeight * .4
    }else{
      if(window.innerWidth > 1280){
        height = window.innerHeight - 64
      }else if(window.innerWidth > 600){
        height = window.innerHeight * .75
      }else{
        height = window.innerHeight * .5
      }
    }
    if(height >= 570){ height = 570}
    return { height, width };
  }
  const sliderItemSize = {
    height: '100%',
    width: window.innerWidth
  }
  const style = {
    container: {
      position: 'relative',
      margin: 'auto',
      maxWidth: 900,
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
    },
    slide: {
      overflow: 'hidden',
    },
    item: {
      height: sliderItemSize.height,
      width: sliderItemSize.width,
      background: '#333',
      minHeight: SliderSize().height,
    },
    leftArrow: {
      left: '2%',
      top: '45%',
      position: 'absolute',
      zIndex: '10',
      background: 'black',
      opacity:'.4'
    },
    rightArrow: {
      right: '2%',
      top: '45%',
      position: 'absolute',
      zIndex: '10',
      background: 'black',
      opacity:'.4'
    },
    imgTitle: {
      position: 'absolute',
      zIndex: '10',
      background: 'black',
      opacity:'.6',
      color: 'white',
      bottom: '0',
      margin: 'auto',
      textAlign: 'center',
      padding: '1rem 0',
      width: '100%',
      maxWidth: 900,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }
  }

  function leftArrowOnclick(){
    if(itemIndex < 1){
      setItemIndex( (slideImageLength + itemIndex - 1)%slideImageLength )
    }else{
      setItemIndex( (itemIndex - 1)%slideImageLength )
    }
  }
  function rightArrowOnclick(){
    setItemIndex( (itemIndex + 1)%slideImageLength )
  }
  function handleAutoPlay(){
    setIntervalId(
      setInterval(rightArrowOnclick, duration)
    )
  }
  function resizeEffect(){
    refresh(rf + 1)
  }

  useEffect(()=>{
    if(autoPlay){ handleAutoPlay() }
    window.addEventListener('resize',resizeEffect)
    return ()=>{
      clearInterval(intervalId);
      window.removeEventListener('resize',resizeEffect)
    }
  },[ itemIndex, window.innerWidth ])

  return(
    <div style={style.container}>
      <div style={style.slide}>
        <IconButton
          className={classes.arrowColor}
          onClick={()=>leftArrowOnclick()}
          style={style.leftArrow}>
          <ArrowBackIcon fontSize="large"/>
        </IconButton>
        <IconButton
          className={classes.arrowColor}
          onClick={()=>rightArrowOnclick()}
          style={style.rightArrow}>
          <ArrowForwardIcon fontSize="large"/>
        </IconButton>
        <SwipeableViews
          enableMouseEvents
          index={itemIndex}>
          { data?
            data.map((d,i)=>
            <Link to={`/match/${i}`} style={{ textDecoration: 'none'}}>
              <div key={i} style={style.item, { overflow: 'hidden' }}>
                <div
                  style={{
                    backgroundImage: `url(${d.img})`,
                    height: SliderSize().height,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}></div>
                <div style={style.imgTitle}>{d.fieldname}</div>
              </div>
            </Link>
            ):
            [ 'https://thai-pga.com/images/pinehurst.jpg',
              'https://thai-pga.com/images/uniland.jpg',
              'https://thai-pga.com/images/watermill.jpg',
              'https://thai-pga.com/images/pinehurst.jpg',
              'https://thai-pga.com/images/muangake.jpg'].map( (d,i)=>
              <div key={i} style={style.item, { overflow: 'hidden' }}>
                <div
                  style={{
                    backgroundImage: `url(${d})`,
                    height: SliderSize().height,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}></div>
                <div style={style.imgTitle}>Loading .... {i}</div>
              </div>
            )
          }
        </SwipeableViews>
      </div>
    </div>
  );
}
const SlideShowStyled = withStyles(styles)(SlideShowBody)

function SlideShow(props){
  const { classes, autoPlay, duration, data } = props;

  const slideAndload = {
    position: 'relative'
  }
  return(
    <div style={slideAndload}>
      <SlideShowStyled
        autoPlay={autoPlay}
        duration={duration}
        data={data}/>
      { !data?
        <div style={{ position: 'relative', maxWidth: 900, margin: 'auto' }}>
          <LinearProgress className={classes.progress}/>
        </div>:null
      }
    </div>
  );
}
export default withStyles(styles)(SlideShow);
