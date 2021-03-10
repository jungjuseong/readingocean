import React , { useState, useEffect } from 'react';
import { getAllBooks, getUserCreatedBooks } from '../util/APIUtils';
import Book from './Book';

import LoadingIndicator  from '../common/LoadingIndicator';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

import { BOOK_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './BookList.css';

function BookList(props) {

    const {username, isAuthenticated, currentUser} = props;

    const [bookState,setBookState] = useState({
            books: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
    });

    const loadBooks = (page = 0, size = BOOK_LIST_SIZE) => {

        let promise = (currentUser) ? getUserCreatedBooks(currentUser.id, page, size) : getAllBooks(page, size);

        if(!promise) {
            return;
        }

        setBookState({
            ...bookState,
            isLoading: true
        });

        promise            
        .then(response => {
            const books = bookState.books.slice();

            setBookState({
                books: books.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            setBookState({
                ...bookState,
                isLoading: false
            })
        });  
        
    }

    useEffect(() => {
        loadBooks();

        return () => {
            setBookState({
                books: [],
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

    const handleLoadMore = () => loadBooks(bookState.page + 1);

    return (
        <div className="polls-container">
            {    
                bookState.books.map((book, index) => <Book key={index} book={book}/>)
            }
            {
                !bookState.isLoading && bookState.books.length === 0 ? (
                    <div className="no-books-found">
                        <span>No Books Found.</span>
                    </div>    
                ): null
            }  
            {
                (!bookState.isLoading && !bookState.last) ? (
                    <div className="load-more-books"> 
                        <Button type="dashed" onClick={handleLoadMore} disabled={bookState.isLoading}>
                            <PlusOutlined /> Load more
                        </Button>
                    </div>): null
            }              
            {
                bookState.isLoading ? <LoadingIndicator />: null                     
            }
        </div>
    );
    
}

export default withRouter(BookList);