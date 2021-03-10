import React, { Component } from 'react';
import './Book.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class Book extends Component {
    render() {      
        return (
            <div className="poll-content">
                <div className="poll-header">
                    <div className="poll-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.book.username}`}>
                            <Avatar className="poll-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.book.createdBy.username)}} >
                                {this.props.book.createdBy.username[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-username">
                                @{this.props.book.createdBy.username}
                            </span>
                            <span className="poll-creation-date">
                                {formatDateTime(this.props.book.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="poll-question">
                        {this.props.poll.question}
                    </div>
                </div>
                <div className="poll-choices">
                    <RadioGroup 
                        className="poll-choice-radio-group" 
                        onChange={this.props.handleVoteChange} 
                        value={this.props.currentVote}>
                        { pollChoices }
                    </RadioGroup>
                </div>
                <div className="poll-footer">
                    { 
                        !(this.props.poll.selectedChoice || this.props.poll.expired) ?
                        (<Button className="vote-button" disabled={!this.props.currentVote} onClick={this.props.handleVoteSubmit}>Vote</Button>) : null 
                    }
                    <span className="total-votes">{this.props.poll.totalVotes} votes</span>
                    <span className="separator">•</span>
                    <span className="time-left">
                        {
                            this.props.poll.expired ? "Final results" :
                            this.getTimeRemaining(this.props.poll)
                        }
                    </span>
                </div>
            </div>
        );
    }
}

function CompletedOrVotedPollChoice(props) {
    return (
        <div className="cv-poll-choice">
            <span className="cv-poll-choice-details">
                <span className="cv-choice-percentage">
                    {Math.round(props.percentVote * 100) / 100}%
                </span>            
                <span className="cv-choice-text">
                    {props.choice.text}
                </span>
                {
                    props.isSelected ? (
                    <Icon
                        className="selected-choice-icon"
                        type="check-circle-o"
                    /> ): null
                }    
            </span>
            <span className={props.isWinner ? 'cv-choice-percent-chart winner': 'cv-choice-percent-chart'} 
                style={{width: props.percentVote + '%' }}>
            </span>
        </div>
    );
}


export default Poll;