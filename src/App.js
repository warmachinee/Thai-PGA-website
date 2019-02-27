import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { fetchUrl } from './data/api'

import Header from './page/Header'
import MainPage from './page/MainPage'
import MatchDetail from './page/MatchDetail'
import MatchList from './components/MatchList'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      dataFromFetch: null
    }
  }
  async componentDidMount(){
    const data = await fetchUrl('https://thai-pga.com/php/SNTshow.php')
    this.setState({dataFromFetch: data})
  }
  render() {
    const matchDetailComponent = ({ match }) =>(
      <MatchDetail
        data={this.state.dataFromFetch}
        matchParams={parseInt(match.params.matchindex)}/>
    )
    return (
      <Router>
        <div>
          <Header />
          <Route exact path="/" render={()=><MainPage data={this.state.dataFromFetch}/>} />
          <Route path="/match/:matchindex" component={matchDetailComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;
