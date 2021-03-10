import React , { useState, useEffect } from 'react';
import { getAllPublishers } from '../util/APIUtils';
import Publisher from './Publisher';

import LoadingIndicator  from '../common/LoadingIndicator';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

import { PUBLISHER_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PublisherList.css';

function PublisherList(props) {

    const {username, type, isAuthenticated} = props;

    const [ publisherState,setPublisherState ] = useState({
            publishers: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
    });

    const loadPublisherList = (page = 0, size = PUBLISHER_LIST_SIZE) =>{
        let promise;

        promise = getAllPublishers(page, size);
        
        if(!promise) {
            return;
        }

        setPublisherState({
            ...publisherState,
            isLoading: true
        });

        promise            
        .then(response => {
            const publishers = publisherState.publishers.slice();

            setPublisherState({
                publishers: publishers.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            setPublisherState({
                ...publisherState,
                isLoading: false
            })
        });  
        
    }

    useEffect(() => {
        loadPublisherList();

        return () => {
            setPublisherState({
                publishers: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            })
          };
    }, [isAuthenticated]);

    const handleLoadMore = () => loadPublisherList(publisherState.page + 1);

    const views = [];
    publisherState.publishers.forEach((publisher) => {
        views.push(<Publisher key={publisher.id} publisher={publisher} />)            
    });

    return (
        <div className="polls-container">
            {views}
            {
                !publisherState.isLoading && publisherState.publishers.length === 0 ? (
                    <div className="no-publishers-found">
                        <span>No Publishers Found.</span>
                    </div>    
                ): null
            }  
            {
                !publisherState.isLoading && !publisherState.last ? (
                    <div className="load-more-publishers"> 
                        <Button type="dashed" onClick={handleLoadMore} disabled={publisherState.isLoading}>
                            <PlusOutlined /> Load more
                        </Button>
                    </div>): null
            }              
            {
                publisherState.isLoading ? 
                <LoadingIndicator />: null                     
            }
        </div>
    );
    
}

export default withRouter(PublisherList);