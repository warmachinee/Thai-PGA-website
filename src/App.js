import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import './App.css';
import { fetchUrl } from './data/api'

import Header from './page/Header'
import MainPage from './page/MainPage'
import MatchDetail from './page/MatchDetail'
import UserPage from './page/UserPage'
import MatchList from './components/MatchList'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      dataFromFetch: null,
      isAuthenticated: false,
      dataAfterAuthen: null
    }
  }
  async componentDidMount(){
    const data = await fetchUrl('https://thai-pga.com/php/SNTshow.php')
    this.setState({dataFromFetch: data})
  }
  doAuthenticate = (data) =>{
    if(data){
      if(data.status === 'Success'){
        this.setState({
          isAuthenticated: true,
          dataAfterAuthen: data
        })
      }else{
        alert(data.status)
      }
    }else{
        alert('Something wrong please check')
    }
  }
  doUnAuthenticate = () =>{
    this.setState({isAuthenticated: false})
  }
  render() {
    const { dataAfterAuthen } = this.state
    const matchDetailComponent = ({ match }) =>(
      <MatchDetail
        data={this.state.dataFromFetch}
        matchParams={parseInt(match.params.matchindex)}/>
    )
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.isAuthenticated ? (
            <UserPage data={ dataAfterAuthen ? dataAfterAuthen:null }/>
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
    return (
      <Router>
        <div>
          <Header
            isAuthenticated={this.state.isAuthenticated}
            doAuthenticate={this.doAuthenticate}
            doUnAuthenticate={this.doUnAuthenticate}/>

          <Route exact path="/"
            render={ ()=><MainPage data={this.state.dataFromFetch}/> }
          />
          <Route path="/match/:matchindex" component={matchDetailComponent}/>
          <PrivateRoute path="/user" />
        </div>
      </Router>
    );
  }
}

export default App;
