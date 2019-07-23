import React, { Component } from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import newChatStyle from './newChatStyle';

const firebase = require('firebase');

class NewChat extends Component {

    state = {
        username: null,
        message: null,
    }

    userTyping = (type, e) => {
        switch (type) {
            case 'username':
                this.setState({ username: e.target.value });
                break;

            case 'message':
                    this.setState({ message: e.target.value });
                break;

            default:
                break;
        }
    }

    // build a doc key
    buildDocKey = () => {
        return [firebase.auth().currentUser.email, this.state.username].sort().join(":")
    }

    chatExists = async () => {
        const docKey = this.buildDocKey();
        const chat = await firebase.firestore().collection('chats').doc(docKey).get();

        console.log(chat.exists);

        return chat.exists;
    }

    // check if a user exisits
    userExists = async () => {
        // get the snapShot obj from firebase
        const userSnapshot = await firebase.firestore().collection('users').get();
        // return the user if its there
        const exists = userSnapshot.docs.map(_doc => _doc.data().email).includes(this.state.username);

        // this.setState({ serverError: !exists});

        return exists;
    }

    // creating chatroom for a new user
    createChat = () => {
        this.props.newChatSubmitFn({
            sendTo: this.state.username,
            message: this.state.message
        });
    }

    goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);

    // submit new chat
    submitNewChat = async (e) => {
        e.preventDefault();
        const userExists = await this.userExists();

        if (userExists) {
            const chatExists = await this.chatExists();
            // will open up the chat messages otherwise create the chat message
            chatExists ? this.goToChat() : this.createChat();
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>

                <Paper className={classes.paper}>

                    <Typography component="h1" variant="h5">Send A message</Typography>

                    <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>

                        <FormControl fullWidth>
                            <InputLabel htmlFor="new-chat-username">
                                Enter your friends Email
                            </InputLabel>

                            <Input
                                required
                                className={classes.input}
                                autoFocus
                                onChange={(e) => this.userTyping('username', e)}
                                id='new-chat-username'
                            ></Input>
                        </FormControl>

                        <FormControl
                            fullWidth
                        >
                            <InputLabel
                                htmlFor="new-chat-message">
                                Enter A Message:
                            </InputLabel>

                            <Input
                                required
                                className={classes.Input}
                                onChange={(e) => this.userTyping('message', e)}
                                id='new-chat-message'
                            >
                            </Input>

                        </FormControl>

                        <Button
                            fullWidth
                            className={classes.submit}
                            variant="contained"
                            color="secondary"
                            type="submit"
                        >
                            Send Message
                        </Button>
                    </form>
                </Paper>
            </main>
        )
    }
}

export default withStyles(newChatStyle)(NewChat);