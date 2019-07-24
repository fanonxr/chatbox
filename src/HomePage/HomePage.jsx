import React, { Component } from 'react';
import { withStyles, Typography, Container, Link, CssBaseline } from '@material-ui/core';
import homePageStyle from './homePageStyle';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';


class HomePage extends Component {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.root}>
                Home page
            </main>
        )
    }
}

export default withStyles(homePageStyle)(HomePage)
