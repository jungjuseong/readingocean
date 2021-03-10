package com.clbee.readingocean.payload;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
public class BookRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 120)
    private String authors;

    @NotBlank
    @Size(max = 13)
    private String isbn;

    @NotBlank
    @Size(max = 140)
    private String publisher;
}
