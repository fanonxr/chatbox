import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import chatListStyle from './chatListStyle';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';

class ChatList extends Component {

    // check if user is sender
    userIsSender = (chat) => chat.messages[chat.messages.length - 1].sender === this.props.userEmail;

    newChat = () => {
        this.props.newChatBtnFn();
    }

    selectChat = (index) => {
        this.props.selectChatFn(index);
    }

    render() {

        const { classes } = this.props;

        if (this.props.chats.length > 0) {

            return (
                <main className={classes.root}>
                    <Button
                        variant='contained'
                        fullWidth
                        color='secondary'
                        className={classes.newChatBtn}
                        onClick={this.newChat}>
                        New Message
                    </Button>
                    <List>
                        {
                            this.props.chats.map((_chat, _index) => {

                                return (
                                    <div key={_index}>
                                        <ListItem
                                            onClick={() => this.selectChat(_index)}
                                            className={classes.listItem}
                                            selected={this.props.selectedChatIndex === _index}
                                            alignItems='flex-start'
                                        >

                                            <ListItemAvatar>
                                                <Avatar alt='Remy Sharp'>{_chat.users.filter(_user => _user !== this.props.userEmail)[0].split('')[0]}</Avatar>
                                            </ListItemAvatar>

                                            <ListItemText
                                                primary={_chat.users.filter(_user => _user !== this.props.userEmail)[0]}
                                                secondary={
                                                    <Fragment>
                                                        <Typography component='span' color='textPrimary'>
                                                            {
                                                                _chat.messages[_chat.messages.length - 1].message.substring(0, 30) + "..."
                                                            }
                                                        </Typography>
                                                    </Fragment>}
                                            >

                                            </ListItemText>
                                            {
                                                _chat.receiverHasRead === false && !this.userIsSender(_chat) ?
                                                    <ListItemIcon>
                                                        <NotificationImportant
                                                            className={classes.unreadMessage}
                                                        ></NotificationImportant>
                                                    </ListItemIcon> : null
                                            }
                                        </ListItem>
                                        <Divider></Divider>
                                    </div>
                                )
                            })
                        }
                    </List>
                </main>
            )
        } else {
            return (
                <main className={classes.root}>
                    <Button
                        variant='contained'
                        fullWidth
                        color='secondary'
                        onClick={this.newChat}
                        className={classes.newChatBtn}
                    >
                        New Message
                    </Button>
                    <List></List>
                </main>
            )
        }
    }
}

export default withStyles(chatListStyle)(ChatList);