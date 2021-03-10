package com.clbee.readingocean.service;

import com.clbee.readingocean.exception.AppException;
import com.clbee.readingocean.exception.BadRequestException;
import com.clbee.readingocean.exception.ResourceNotFoundException;
import com.clbee.readingocean.model.*;
import com.clbee.readingocean.payload.*;
import com.clbee.readingocean.repository.BookRepository;
import com.clbee.readingocean.repository.RoleRepository;
import com.clbee.readingocean.repository.UserRepository;
import com.clbee.readingocean.security.CustomUserDetails;
import com.clbee.readingocean.util.AppConstants;
import com.clbee.readingocean.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    RoleRepository roleRepository;

    public PagedResponse<BookResponse> getAllBooks(CustomUserDetails currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Books
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Book> books = bookRepository.findAll(pageable);

        if(books.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), books.getNumber(),
                    books.getSize(), books.getTotalElements(), books.getTotalPages(), books.isLast());
        }

        List<BookResponse> bookResponses = books.map(book -> {
            return ModelMapper.mapBookToBookResponse(book, book.getUser());
        }).getContent();

        return new PagedResponse<>(bookResponses, books.getNumber(),
                books.getSize(), books.getTotalElements(), books.getTotalPages(), books.isLast());
    }

    public PagedResponse<BookResponse> getBooksCreatedBy(Long userId, CustomUserDetails currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", userId));

        // Retrieve all books created by the given userId
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Book> books = bookRepository.findByUserId(userId, pageable);

        if (books.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), books.getNumber(),
                    books.getSize(), books.getTotalElements(), books.getTotalPages(), books.isLast());
        }

        // Map Books to BookResponses
        List<Long> bookIds = books.map(Book::getId).getContent();

        List<BookResponse> responses = books.map(book -> {
            return ModelMapper.mapBookToBookResponse(book, user);
        }).getContent();

        return new PagedResponse<>(responses, books.getNumber(),
                books.getSize(), books.getTotalElements(), books.getTotalPages(), books.isLast());
    }

    public Book createBook(BookRequest request) {
        return createBook(request.getTitle(), request.getIsbn(),request.getAuthors(), request.getPublisher());
    }

    public Book createBook(String title, String isbn, String authors, String publisher) {
        if (userRepository.existsByUsername(publisher)) {
            User user = userRepository.findByUsername(publisher)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username : " + publisher)
                    );

            Book book = new Book(title, isbn, authors);
            book.setUser(user);
            bookRepository.save(book);
        }
        return new Book();
    }

    public void createUserAccount(String name, String password, RoleName role) {

        if (!userRepository.existsByUsername(name)) {
            User user = new User(name, name, password);
            Role userRole = roleRepository.findByName(role)
                    .orElseThrow(() -> new AppException("Role not set."));

            user.setRoles(Collections.singleton(userRole));
            userRepository.save(user);
        }
    }

    public BookResponse getBookById(Long id, CustomUserDetails currentUser) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book", "id", id));

        // Retrieve book creator details
        User creator = userRepository.findById(book.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", book.getUser().getUsername()));

        return ModelMapper.mapBookToBookResponse(book, creator);
    }

    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0)
            throw new BadRequestException("Page number cannot be less than zero.");

        if(size > AppConstants.MAX_PAGE_SIZE)
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
    }
}
