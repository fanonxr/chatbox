import React, { Component } from 'react';
import chatViewStyle from './chatViewStyle';
import { withStyles } from '@material-ui/core/styles';

class ChatView extends Component {

    componentDidUpdate = () => {
        const container = document.getElementById('chatview-container');

        // check to see if the container exists
        if (container) {
            container.scrollTo(0, container.scrollHeight);
        }
    }

    render() {
        const { classes, chat, user } = this.props;

        if (chat === undefined) {
            // if there are no chats display an empty main tag
            return (<main id={'chatview-container'} className={classes.content}></main>)
        } else {
            return (
                <div>
                    <div className={classes.chatHeader}>
                        Conversation with {chat.users.filter(_user => _user !== user)[0]}
                    </div>
                    <main id={'chatview-container'} classes={classes.content}>
                        {
                            chat.messages.map((_msg, _index) => {
                                return (
                                    <div key={_index} className={_msg.sender === user ? classes.userSent : classes.friendSent}>
                                        {_msg.message}
                                    </div>
                                )
                            })
                        }
                    </main>
                </div>
            )
        }
    }
}

export default withStyles(chatViewStyle)(ChatView);
