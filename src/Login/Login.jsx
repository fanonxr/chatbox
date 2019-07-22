import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import loginStyle from './loginStyle';
import FormContol from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseLine from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const firebase = require('firebase');

class Login extends Component {

    state = {
        email: null,
        password: null,
        loginError: ''
    }

    // submitting login form
    submitLogin = (e) => {
        e.preventDefault();
        console.log("Submitting");

        // login through firebase with creds
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push('/dashboard');
            }, err => {
                    this.setState({ loginError: 'server error' });
                    console.log(err);
            });
    }

    // user typing - updating the state when typing
    userTyping = (type, e) => {
        switch (type) {
            case 'email':
                this.setState({ email: e.target.value });
                break;

            case 'password':
                    this.setState({ password: e.target.value });
                break;

            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseLine></CssBaseLine>

                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Login:
                    </Typography>

                    <form className={classes.form} onSubmit={(e) => this.submitLogin(e)}>
                        <FormContol required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-email-input'>Email: </InputLabel>
                            <Input onChange={(e) => this.userTyping('email', e)} autoComplete='email' autoFocus id='login-email-input'></Input>
                        </FormContol>

                        <FormContol required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-password-input'>Password: </InputLabel>
                            <Input type='password' onChange={(e) => this.userTyping('password', e)} autoFocus id='login-password-input'></Input>
                        </FormContol>

                        <Button type='submit' fullWidth variant='contained' color='secondary' className={classes.submit}>Submit</Button>
                    </form>

                    {
                        this.state.loginError ? <Typography className={classes.errorText} component='h5' variant='h6'>
                            Incorrect Login Information
                        </Typography> : null
                    }

                    <Typography component='h5' variant='h6' className={classes.noAccountHeader}>Don't have an account?</Typography>
                    <Link className={classes.signupLink} to='/signup'>Sign Up Here</Link>
                </Paper>
            </main>
        )
    }
}

export default withStyles(loginStyle)(Login);
