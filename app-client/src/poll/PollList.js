import React, { useEffect, useState } from 'react';

import { getAllPolls, getUserCreatedPolls, getUserVotedPolls } from '../util/APIUtils';
import Poll from './Poll';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';

import { Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PollList.css';

function PollList(props) {

    const { username, type } = props;
    const [ pollState, setPollState ] = useState({
        polls: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        currentVotes: [],
        isLoading: false
    });

    const loadPollList = (page = 0, size = POLL_LIST_SIZE) => {
        let promise;
        if(username) {
            if(type === 'USER_CREATED_POLLS')
                promise = getUserCreatedPolls(username, page, size);
            else if (type === 'USER_VOTED_POLLS')
                promise = getUserVotedPolls(username, page, size);                                    
        } else {
            promise = getAllPolls(page, size);
        }

        if(!promise) {
            return;
        }

        setPollState({
            ...pollState,
            isLoading: true
        });

        promise.then(response => {
            const slicedPolls = pollState.polls.slice();
            const currentVotes = pollState.currentVotes.slice();

            setPollState({
                polls: slicedPolls.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                isLoading: false
            });
        }).catch(error => {
            setPollState({
                ...pollState,
                isLoading: true
            });
        });  
    }

    useEffect(() => {
        loadPollList();

        return () => {
            setPollState({
                polls: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            })
          };
    }, [props.isAuthenticated]);

    const handleLoadMore = () => loadPollList(pollState.page + 1);

    const handleVoteChange = (e, index) => {
        const currentVotes = pollState.currentVotes.slice();
        currentVotes[index] = e.target.value;

        setPollState({
            ...pollState,
            currentVotes: currentVotes
        });
    }

    const handleVoteSubmit = (e,pollIndex) => {
        e.preventDefault();
        if(!props.Co) {
            props.history.push("/login");
            notification.info({
                message: 'ReadingOcean Admin',
                description: "Please login to vote.",          
            });
            return;
        }

        const poll = pollState.polls[pollIndex];
        const selectedChoice = pollState.currentVotes[pollIndex];

        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
        .then(response => {
            const polls = pollState.polls.slice();
            polls[pollIndex] = response;
            setPollState({
                ...pollState,
                polls: polls
            });        
        }).catch(error => {
            if(error.status === 401) {
                props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');    
            } else {
                notification.error({
                    message: 'ReadingOcean Admin',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });                
            }
        });
    }
    
    const views = [];
    if(pollState && pollState.polls) {
        pollState.polls.forEach((poll, index) => {
            views.push(
                <Poll 
                    key={poll.id} 
                    poll={poll}
                    currentVote={pollState.currentVotes[index]} 
                    handleVoteChange={(e) => handleVoteChange(e,index)}
                    handleVoteSubmit={(e) => handleVoteSubmit(e,index)} />)            
        });
    }
    return (
        <div className="polls-container">
            {views}
            {
                (!pollState.isLoading && pollState.polls.length === 0) ? (
                    <div className="no-polls-found">
                        <span>No Polls Found.</span>
                    </div>    
                ): null
            }  
            {
                (!pollState.isLoading && !pollState.last) ? (
                    <div className="load-more-polls"> 
                        <Button type="dashed" onClick={handleLoadMore} disabled={pollState.isLoading}>
                            <PlusOutlined /> Load more
                        </Button>
                    </div>): null
            }              
            {
                pollState.isLoading ? <LoadingIndicator /> : null                     
            }
        </div>
    );
    
}

export default withRouter(PollList);