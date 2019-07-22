import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import signupStyle from './signupStyle';

const firebase = require("firebase");

class SignUp extends Component {

    state = {
        email: null,
        password: null,
        passwordConfirmation: null,
        signupError: ''
    }

    // function to handle sign up of user
    submitSignup = (e) => {
        e.preventDefault();

        // check if the form is valid
        if (!this.formIsValid()) {
            this.setState({ signupError: "Passwords do not match!" });
            return;
        }

        // add the user to the firebase database
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(authRes => {
                const userObj = {
                    email: authRes.user.email
                };
                // send user obj to database
                firebase
                    .firestore()
                    .collection('users')
                    .doc(this.state.email)
                    .set(userObj)
                    .then(() => {
                        this.props.history.push('/dashboard');
                    }, dbError => {
                            console.log(dbError);
                            this.setState({ signupError: 'Failed to add the user to the db' });
                    })
            }, authError => {
                    console.log(authError);
                    this.setState({ signupError: 'Failed to add user' });
            })
    }

    // function to handle
    userTyping = (type, e) => {
        switch (type) {
            case 'email':
                this.setState({
                    email: e.target.value
                })
                break;

            case 'password':
                this.setState({
                    password: e.target.value
                });
                break;

            case 'passwordConfirmation':
                this.setState({
                    passwordConfirmation: e.target.value
                });
                break;

            default:
                break;
        }
    }

    // check to see if both passwords are the same
    formIsValid = () => this.state.password === this.state.passwordConfirmation;

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Sign Up!
                    </Typography>
                    <form
                        onSubmit={(e) => this.submitSignup(e)}
                        className={classes.form}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='signup-email-input'>
                                Enter Your Email:
                            </InputLabel>
                            <Input
                                autoComplete='email'
                                autoFocus
                                id='signup-email-input'
                                onChange={(e) => this.userTyping('email', e)} >
                            </Input>
                        </FormControl>

                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='signup-password-input'>Create A Password: </InputLabel>
                            <Input
                                onChange={(e) => this.userTyping('password', e)}
                                type='password'
                                id='signup-password-input'>
                                </Input>
                        </FormControl>

                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='signup-password-confirmation-input'>Confirm You Password: </InputLabel>
                            <Input
                                onChange={(e) => this.userTyping('passwordConfirmation', e)}
                                type='password'
                                id='signup-password-confirmation-input'>
                                </Input>
                        </FormControl>

                        <Button type='submit' fullWidth variant='contained' color='secondary' className={classes.submit}>
                            Submit
                        </Button>
                    </form>
                    {
                        this.state.signupError ? <Typography className={classes.errorText} component="h5" variant="h6">
                            {this.state.signupError}
                        </Typography> : null
                    }
                    <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>Already Have an account?</Typography>
                    <Link to='/login' className={classes.logInLink}>Login!</Link>
                </Paper>
            </main>
        )
    }
}

export default withStyles(signupStyle)(SignUp);
