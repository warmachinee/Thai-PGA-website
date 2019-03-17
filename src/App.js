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
import AdminPage from './page/AdminPage'
import MatchList, { MatchListPaper } from './components/MatchList'

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      dataFromFetch: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,
      dataAfterAuthen: null
    }
  }
  async doFetchData(){
    const data = await fetchUrl('https://www.thai-pga.com/api/loadmainmatch')
    this.setState({dataFromFetch: data})
  }

  doAuthenticate = (data) =>{
    this.setState({
      isAuthenticated: true,
      dataAfterAuthen: data
    })
  }
  doUnAuthenticate = () =>{
    this.setState({isAuthenticated: false})
  }
  doAdminAuthenticate = (data) =>{
    this.setState({
      isAdminAuthenticated: true,
      dataAfterAuthen: data
    })
  }
  doAdminUnAuthenticate = () =>{
    this.setState({isAdminAuthenticated: false})
  }
  componentDidMount(){
    this.doFetchData()
  }
  render() {
    const { dataAfterAuthen } = this.state

    const MatchDetailComponent = ({ match }) =>(
      <MatchDetail
        data={this.state.dataFromFetch}
        urlParams={match}
        matchParams={parseInt(match.params.matchindex)}/>
    )
    const MatchListComponent = () => (
      <MatchListPaper>
        <IconButton onClick={()=>window.history.go(-1)}>
          <ArrowBackIcon fontSize="large"/>
        </IconButton>
        <MatchList data={this.state.dataFromFetch}/>
      </MatchListPaper>
    )
    const MatchComponent = () => (
      <div style={{ marginTop: window.innerWidth > 600 ? 64: 56 }}>

        <Route exact path="/match" component={MatchListComponent}/>
        <Route path="/match/:matchindex" component={MatchDetailComponent}/>
      </div>
    )
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.isAuthenticated ? (
            <UserPage data={ dataAfterAuthen ? dataAfterAuthen:null }/>
          ) : (
            <Redirect to='/' />
          )
        }
      />
    );
    const AdminRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.isAdminAuthenticated ? (
            <AdminPage data={ dataAfterAuthen ? dataAfterAuthen:null }/>
          ) : (
            <Redirect to='/' />
          )
        }
      />
    );
    return (
      <div>
        <Header
          isAuthenticated={this.state.isAuthenticated}
          isAdminAuthenticated={this.state.isAdminAuthenticated}
          doAuthenticate={this.doAuthenticate}
          doAdminAuthenticate={this.doAdminAuthenticate}
          doUnAuthenticate={this.doUnAuthenticate}
          doAdminUnAuthenticate={this.doAdminUnAuthenticate}/>

        <Route exact path="/"
          render={ ()=><MainPage data={this.state.dataFromFetch}/> }/>

        <Route path="/match" component={MatchComponent}/>
        <PrivateRoute path="/user" />
        <AdminRoute path="/admin" />
        { this.state.isAdminAuthenticated ? <Redirect to='/admin' />:null }
      </div>
    );
  }
}

export default App;
