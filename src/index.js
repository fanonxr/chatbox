import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import HomePage from './HomePage/HomePage'
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Dashboard from './Dashboard/Dashboard';

// firebase configuration
const firebase = require('firebase');
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyAT7OC-99yI0jxV40bV15m8YTjZ9lzu3Ac",
    authDomain: "chatbox-b8ad6.firebaseapp.com",
    databaseURL: "https://chatbox-b8ad6.firebaseio.com",
    projectId: "chatbox-b8ad6",
    storageBucket: "chatbox-b8ad6.appspot.com",
    messagingSenderId: "1002408268712",
    appId: "1:1002408268712:web:9713a0ca1a97eff4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const routing = (
    <Router>
        <div id='routing-container'>
            <Route exact path='/' component={HomePage}></Route>
            <Redirect from="/" to="Login"></Redirect>
            <Route path='/login' component={Login} ></Route>
            <Route path='/signup' component={SignUp} ></Route>
            <Route path='/dashboard' component={Dashboard} ></Route>
        </div>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
