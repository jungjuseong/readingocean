package com.clbee.readingocean.repository;

import com.clbee.readingocean.model.Book;
import com.clbee.readingocean.model.Poll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByIdIn(List<Long> bookIds);
    Optional<Book> findByIsbn(String isbn);
    Page<Book> findByUserId(Long userId, Pageable pageable);
    Boolean existsByIsbn(String isbn);
}
