import React, { Component } from 'react';
import ChatList from '../ChatList/ChatList';
import { Button, withStyles } from '@material-ui/core';
import dashboardStyle from '../Dashboard/dashboardStyle';
import ChatView from '../ChatView/ChatView';
import ChatTextBox from '../ChatTextBox/ChatTextBox';
import NewChat from '../NewChat/NewChat';

const firebase = require('firebase');

class Dashboard extends Component {

    state = {
        selectedChat: null,
        newChatFormVisible: false,
        email: null,
        chats: []
    }

    // handling when a user wants to send a new message to a new users
    newChatBtnCliked = () => {
        this.setState({ newChatFormVisible: true, selectedChat: null });
    }

    // selecting a chat to view its contents
    selectChat = async (chatIndex) => {
        await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
        this.messageRead();

    }

    // signout function from firebase
    signOut = () => firebase.auth().signOut();

    buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

    // reciever of messages will get notified
    clickedChatWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;

    // check to see if the message has been read
    messageRead = () => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => _user !== this.state.email)[0]);

        if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
            // update reciever has read
            firebase.firestore().collection('chats').doc(docKey)
            .update({receiverHasRead: true })
        }
    }

    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => _user !== this.state.email)[0]);

        // add the message to firebase
        firebase.firestore().collection('chats').doc(docKey)
            .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                sender: this.state.email,
                message: msg,
                timestamp: Date.now()
            }),
                receiverHasRead: false
        })
    }

    //
    goToChat = async (docKey, msg) => {
        const usersInChat = docKey.split(':');
        const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));

        this.setState({ newChatFormVisible: false });
        await this.selectChat(this.state.chats.indexOf(chat));
        this.submitMessage(msg);
    }

    //
    newChatSubmit = async (chatObj) => {
        const docKey = this.buildDocKey(chatObj.sendTo);

        await firebase.firestore().collection('chats').doc(docKey)
            .set({
                receiverHasRead: false,
                users: [this.state.email, chatObj.sendTo],
                messages: [{
                    message: chatObj.message,
                    sender: this.state.email
                }]
            })

        // update the state
        this.setState({ newChatFormVisible: false });
        this.selectChat(this.state.chats.length - 1);
    }

    componentDidMount = () => {
        // redirect to login page if not user
        firebase.auth().onAuthStateChanged(async _user => {
            if (!_user) {
                this.props.history.push('/login');
            } else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _user.email)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            email: _user.email,
                            chats: chats
                        });
                })
            }
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div id='dashboard-container'>
                <ChatList
                    history={this.props.history}
                    newChatBtnFn={this.newChatBtnCliked}
                    selectChatFn={this.selectChat}
                    chats={this.state.chats}
                    userEmail={this.state.email}
                    selectedChatIndex={this.state.selectedChat}
                >
                </ChatList>

                {
                    this.state.newChatFormVisible ? null :
                        <ChatView
                            user={this.state.email}
                            chat={this.state.chats[this.state.selectedChat]}
                        ></ChatView>
                }

                {
                    this.state.selectedChat !== null && !this.state.newChatFormVisible ?
                        <ChatTextBox
                            submitMessageFn={this.submitMessage}
                            messageReadFn={this.messageRead}
                        ></ChatTextBox> :
                        null
                }

                {
                    this.state.newChatFormVisible ?
                        <NewChat
                            goToChatFn={this.goToChat}
                            newChatSubmitFn={this.newChatSubmit}
                    ></NewChat> : null
                }
                <Button className={classes.signOutBtn} onClick={this.signOut}> Sign Out </Button>
            </div>
        )
    }
}

export default withStyles(dashboardStyle)(Dashboard);