import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import chatTextBoxStyle from './chatTextBoxStyle';
import { withStyles } from '@material-ui/core/styles';

class ChatTextBox extends Component {

    state = {
        chatText: ''
    };

    // handling typing of user input - will update state
    userTyping = (e) => {
        // update the state to what the user has typed
        // 13 = enter key
        e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });
    }

    // message valid - return false if empty string or mutiple spaces
    messageValid = (txt) => txt && txt.replace(/\s/g, '').length;

    // handling clicked input for submitting
    userClickedInput = () => {
        console.log("Clicked input");
    }

    // send message to other user
    submitMessage = () => {
        if (this.messageValid(this.state.chatText)) {
            // call parent function
            this.props.submitMessageFn(this.state.chatText);
            // get rid of text that was sent
            document.getElementById('chattextbox').value = '';
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.chatTextBoxContainer}>
                <TextField
                    id='chattextbox'
                    placeholder='Message...'
                    onKeyUp={(e) => this.userTyping(e)}
                    className={classes.chatTextBox}
                    onFocus={this.userClickedInput}
                ></TextField>
                <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
            </div>
        )
    }
}

export default withStyles(chatTextBoxStyle)(ChatTextBox);
