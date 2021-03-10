import React from 'react';
import './Poll.css';
import { Avatar } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

function Poll(props) {

    const { poll } = props;

    const calculatePercentage = (choice) =>  (poll.totalVotes === 0) ? 0 : (choice.voteCount*100)/(poll.totalVotes);
    
    const isSelected = (choice) =>  poll.selectedChoice === choice.id;
    
    const getWinningChoice = () => 
        poll.choices.reduce((prevChoice, currentChoice) => 
            (currentChoice.voteCount > prevChoice.voteCount) ? currentChoice : prevChoice, 
            {voteCount: -Infinity}
        );
    
    const getTimeRemaining = (poll) => {
        const expirationTime = new Date(poll.expirationDateTime).getTime();
        const currentTime = new Date().getTime();
    
        var difference_ms = expirationTime - currentTime;
        var seconds = Math.floor( (difference_ms/1000) % 60 );
        var minutes = Math.floor( (difference_ms/1000/60) % 60 );
        var hours = Math.floor( (difference_ms/(1000*60*60)) % 24 );
        var days = Math.floor( difference_ms/(1000*60*60*24) );
    
        let timeRemaining;
    
        if(days > 0) 
            timeRemaining = days + " days left";
        else if (hours > 0) 
            timeRemaining = hours + " hours left";
        else if (minutes > 0)
            timeRemaining = minutes + " minutes left";
        else if(seconds > 0)
            timeRemaining = seconds + " seconds left";
        else
            timeRemaining = "less than a second left";
        
        return timeRemaining;
    }

    
    const pollChoices = [];
    if(poll.selectedChoice || poll.expired) {
        const winningChoice = poll.expired ? getWinningChoice() : null;

        poll.choices.forEach(choice => {
            pollChoices.push(<CompletedOrVotedPollChoice 
                key={choice.id} 
                choice={choice}
                isWinner={winningChoice && choice.id === winningChoice.id}
                isSelected={isSelected(choice)}
                percentVote={calculatePercentage(choice)} 
            />);
        });                
    } else {
        poll.choices.forEach(choice => {
            pollChoices.push(<Radio className="poll-choice-radio" key={choice.id} value={choice.id}>{choice.text}</Radio>)
        })    
    }        
    return (
        <div className="poll-content">
            <div className="poll-header">
                <div className="poll-creator-info">
                    <Link className="creator-link" to={`/users/${poll.createdBy.username}`}>
                        <Avatar className="poll-creator-avatar" 
                            style={{ backgroundColor: getAvatarColor(poll.createdBy.name)}} >
                            {poll.createdBy.name[0].toUpperCase()}
                        </Avatar>
                        <span className="poll-creator-name">
                            {poll.createdBy.name}
                        </span>
                        <span className="poll-creator-username">
                            @{poll.createdBy.username}
                        </span>
                        <span className="poll-creation-date">
                            {formatDateTime(poll.creationDateTime)}
                        </span>
                    </Link>
                </div>
                <div className="poll-question">
                    {poll.question}
                </div>
            </div>
            <div className="poll-choices">
                <RadioGroup 
                    className="poll-choice-radio-group" 
                    onChange={props.handleVoteChange} 
                    value={props.currentVote}>
                    { pollChoices }
                </RadioGroup>
            </div>
            <div className="poll-footer">
                { 
                    !(poll.selectedChoice || poll.expired) ?
                    (<Button className="vote-button" disabled={!props.currentVote} onClick={props.handleVoteSubmit}>Vote</Button>) : null 
                }
                <span className="total-votes">{poll.totalVotes} votes</span>
                <span className="separator">•</span>
                <span className="time-left">
                    {
                        poll.expired ? "Final results" :
                        getTimeRemaining(poll)
                    }
                </span>
            </div>
        </div>
    );
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
                    props.isSelected ? (<CheckCircleOutlined className="selected-choice-icon"/> ): null
                }    
            </span>
            <span className={props.isWinner ? 'cv-choice-percent-chart winner': 'cv-choice-percent-chart'} 
                style={{width: props.percentVote + '%' }}>
            </span>
        </div>
    );
}


export default Poll;