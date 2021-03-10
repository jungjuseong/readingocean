package com.clbee.readingocean.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class BookResponse {
    private Long id;
    private String title;
    private String isbn;
    private String authors;
    private String publisher;
    private Instant createdAt;
}
