import React, { Component, Fragment } from 'react';
import ChatList from '../ChatList/ChatList';
import { withStyles } from '@material-ui/core/styles';
import dashboardStyle from '../Dashboard/dashboardStyle';

const firebase = require('firebase');

class Dashboard extends Component {

    state = {
        selectedChat: null,
        newChatFormVisible: false,
        email: null,
        chats: []
    }

    //

    newChatBtnCliked = () => {
        console.log("new chat button clicked");
        this.setState({ newChatFormVisible: true, selectedChat: null });
    }

    // selecting a chat to view its contents
    selectChat = (chatIndex) => {
        console.log("Select a chat", chatIndex);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _user => {
            if (!_user) {
                this.props.history.push('/login');
            } else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _user.email)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data())
                        await this.setState({
                            email: _user.email,
                            chats: chats
                        });
                        console.log(this.state);
                })
            }
        })
    }

    render() {
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
            </div>
        )
    }
}

export default withStyles(dashboardStyle)(Dashboard);