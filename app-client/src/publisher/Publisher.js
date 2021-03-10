import React from 'react';
import './Book.css';

import { Avatar } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';

function Book(props) {   
    
    const {book} = props;

    return (
        <div className="poll-content">
            <div className="poll-header">
                <div className="poll-creator-info">
                    <Link className="creator-link" to={`/users/${book.publisher}`}>
                        <Avatar className="poll-creator-avatar" 
                            style={{ backgroundColor: getAvatarColor(book.authors)}} >
                            {book.authors[0].toUpperCase()}
                        </Avatar>
                        <span className="poll-creator-username">
                            @{book.isbn}
                        </span>
                        <span className="poll-creation-date">
                            {formatDateTime(book.createdAt)}
                        </span>
                    </Link>
                </div>
                <div className="poll-question">
                    {book.title}
                </div>
            </div>
        </div>
    );
    
}

export default Book;