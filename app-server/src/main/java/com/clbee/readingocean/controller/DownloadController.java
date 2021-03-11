package com.clbee.readingocean.controller;

import com.clbee.readingocean.exception.ResourceNotFoundException;
import com.clbee.readingocean.model.Book;
import com.clbee.readingocean.model.Download;

import com.clbee.readingocean.payload.BookResponse;
import com.clbee.readingocean.payload.DownloadResponse;
import com.clbee.readingocean.payload.PagedResponse;
import com.clbee.readingocean.repository.BookRepository;
import com.clbee.readingocean.repository.DownloadRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/downloads")
public class DownloadController {

    private static final Logger logger = LoggerFactory.getLogger(DownloadController.class);

    @Autowired
    private DownloadRepository downloadRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public DownloadResponse logDownload(@RequestParam(value="isbn") String isbn,
                                        @RequestParam(value="subscriber") String subscriber) {

        String message = "Success";
        if (bookRepository.existsByIsbn(isbn)) {
            List<Book> bookList = bookRepository.findByIsbn(isbn);
                   // orElseThrow(() -> new ResourceNotFoundException("Book", "isbn", isbn));

            if (bookList.size() > 0) {
                logger.info(bookList.get(0).getTitle());

                Download download = new Download(subscriber);
                download.setBook(bookList.get(0));

                downloadRepository.save(download);
                
                message = String.format("Found %s books.", bookList.size());

            }
        }
        else
            throw new ResourceNotFoundException("Book", "isbn", isbn);

        return new DownloadResponse(message);
    }
}
