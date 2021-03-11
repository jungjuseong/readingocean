package com.clbee.readingocean.repository;

import com.clbee.readingocean.model.Book;
import com.clbee.readingocean.model.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {

    Optional<Book> findById(String isbn);

    Boolean existsById(String isbn);
}
