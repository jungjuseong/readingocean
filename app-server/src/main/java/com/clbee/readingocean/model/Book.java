package com.clbee.readingocean.model;

import com.clbee.readingocean.model.audit.DateAudit;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "books")
public class Book extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 13)
    private String isbn;

    @NotBlank
    @Size(max = 120)
    private String authors;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Book(String title, String isbn, String authors) {
        this.title = title;
        this.isbn = isbn;
        this.authors = authors;
    }
}
