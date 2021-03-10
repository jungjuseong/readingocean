package com.clbee.readingocean.controller;

import com.clbee.readingocean.model.Book;
import com.clbee.readingocean.model.Poll;
import com.clbee.readingocean.payload.*;
import com.clbee.readingocean.repository.BookRepository;
import com.clbee.readingocean.repository.UserRepository;
import com.clbee.readingocean.security.CurrentUser;
import com.clbee.readingocean.security.CustomUserDetails;
import com.clbee.readingocean.service.BookService;
import com.clbee.readingocean.service.PollService;
import com.clbee.readingocean.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookService bookService;

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @GetMapping
    public PagedResponse<BookResponse> getPolls(@CurrentUser CustomUserDetails currentUser,
                                                @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return bookService.getAllBooks(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> createBook(@Valid @RequestBody BookRequest request) {
        Book book = bookService.createBook(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{bookId}")
                .buildAndExpand(book.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Book Created Successfully"));
    }


    @GetMapping("/{bookId}")
    public BookResponse getBookById(@CurrentUser CustomUserDetails currentUser,  @PathVariable Long bookId) {
        return bookService.getBookById(bookId, currentUser);
    }

}
