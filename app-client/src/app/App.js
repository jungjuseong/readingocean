import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, withRouter, Switch} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import BookList from '../book/BookList';
import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import { Layout, notification } from 'antd';
const { Content } = Layout;

function App(props) {

  const [appState, setAppState] = useState({
    currentUser: null,
    isAuthenticated: false,
    isLoading: false
  });

  notification.config({
    placement: 'topRight',
    top: 70,
    duration: 3,
  });  

  const loadCurrentUser = () => {
    setAppState({
        ...appState,
        isLoading: true
    });
    getCurrentUser().then(response => {
        setAppState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
    }).catch(error => {
        setAppState({
          ...appState,
          isLoading: false
        });  
    });
  }

  useEffect(() => {
    loadCurrentUser()
  },[]);

  const handleLogout = (redirectTo="/", notificationType="success", description="You're successfully logged out.") => {
    localStorage.removeItem(ACCESS_TOKEN);

    setAppState({
      ...appState,
      currentUser: null,
      isAuthenticated: false
    });

    props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Reading Ocean Admin',
      description: description,
    });
  }

  const handleLogin = () => {
    notification.success({
      message: 'Reading Ocean',
      description: "You're successfully logged in.",
    });
    loadCurrentUser();
    props.history.push("/");
  }

    return (appState.isLoading) ? <LoadingIndicator /> :
      (
        <Layout className="app-container">
          <AppHeader isAuthenticated={appState.isAuthenticated} currentUser={appState.currentUser} onLogout={handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>      
                <Route exact path="/" 
                  render={(props) => <BookList isAuthenticated={appState.isAuthenticated} 
                      currentUser={appState.currentUser} handleLogout={handleLogout} {...props} />}>
                </Route>
                <Route path="/login" 
                  render={(props) => <Login onLogin={handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username" 
                  render={(props) => <Profile isAuthenticated={appState.isAuthenticated} currentUser={appState.currentUser} {...props}  />}>
                </Route>
                <PrivateRoute authenticated={appState.isAuthenticated} path="/poll/new" component={NewPoll} handleLogout={handleLogout}></PrivateRoute>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
}

export default withRouter(App);
