import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
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
    zIndex: 10
  }
};

function SlideShow(props){
  const { classes, autoPlay, duration, data } = props;
  const slideImageLength = data? data.length : 0
  const [ itemIndex, setItemIndex ] = useState(0)
  const [ sliderPosition, setSliderPosition ] = useState(0)
  const [ intervalId, setIntervalId ] = useState(null)
  const [ imgLoaded, setImgLoaded ] = useState([])
  const [ rf, refresh ] = useState(0)

  function sliderSizeWidth(){
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
  const sliderSize = {
    height: sliderSizeWidth().height,
    maxHeight: 700
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
    slideList: {
      height: sliderSize.height,
      width: sliderItemSize.width * 4,
      transform: `translateX(-${sliderPosition}px)`,
      transition: '.2s',
      display: 'inline-flex'
    },
    item: {
      height: sliderItemSize.height,
      width: sliderItemSize.width,
      background: '#333'
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
      width: sliderItemSize.width,
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
  function handleImgLoaded(){
    for(var i = 0;i < 4;i++){
      imgLoaded[i] = false
    }
  }

  useEffect(()=>{
    setSliderPosition( itemIndex*sliderItemSize.width )
    if(autoPlay){ handleAutoPlay() }
    window.addEventListener('resize',resizeEffect)
    return ()=>{
      clearInterval(intervalId);
      window.removeEventListener('resize',resizeEffect)
    }
  },[ itemIndex, window.innerWidth ])
  useEffect(()=>{
    handleImgLoaded()
  },[ ])
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
        { !imgLoaded.every( item => item === true )? <LinearProgress className={classes.progress}/>:null }
        <div
          style={style.slideList}>
          { data?
            data.map((d,i)=>
            <Link to={`/match/${i}`} style={{ textDecoration: 'none'}}>
              <div key={i} style={style.item}>
                <img
                  src={d.img}
                  onLoad={imgLoaded[i] = true}
                  style={{ width: '100%',height: '100%'}}/>
                <div style={style.imgTitle}>{d.fieldname}</div>
              </div>
            </Link>
            ):
            <div style={style.item}>
              <img
                style={{ width: '100%',height: '100%'}}/>
              <div style={style.imgTitle}>Loading ....</div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
export default withStyles(styles)(SlideShow);
