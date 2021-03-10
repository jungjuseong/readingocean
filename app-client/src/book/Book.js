import React from 'react';
import './Book.css';

import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

function Book(props) {   
    
    const {book} = props;

    return (
        <div className="book-content">
            <div className="book-header">
                <div className="book-title">
                    {book.title}
                </div>
                <div className="book-creator-info">
                    <Link className="creator-link" to={`/users/${book.publisher}`}>
                        <Avatar className="book-creator-avatar" 
                            style={{ backgroundColor: getAvatarColor(book.publisher)}} >
                            {book.publisher.slice(0,4)}
                        </Avatar>
                        <span className="book-creator-username">
                            @{book.authors}
                        </span>
                        <span className="book-creation-date">
                            {formatDateTime(book.createdAt)}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
    
}

export default Book;