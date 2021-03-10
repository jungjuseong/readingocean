package com.clbee.readingocean.service;

import com.clbee.readingocean.model.Book;
import com.clbee.readingocean.model.RoleName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;

@Service
public class BookRegisterService {

    private static final Logger logger = LoggerFactory.getLogger(BookRegisterService.class);

    @Autowired
    BookService bookService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Value("${datafile.books}")
    private String fileName;

    @Value("${users.admin}")
    private String admins;

    @Value("${users.subscriber}")
    private String subscribers;

    // get a file from the resources folder
    private InputStream getFileFromResourceAsStream() {
        // The class loader that loaded the class
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream(fileName);

        // the stream holding the file content
        if (inputStream == null)
            throw new IllegalArgumentException("file not found! " + fileName);
        else
            return inputStream;
    }

    public void addUsers() {
        final String password = this.passwordEncoder.encode("54321");

        String[] adminList = admins.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
        for(String admin : adminList)
            bookService.createUserAccount(admin.trim(), password, RoleName.ROLE_ADMIN);

        String[] subscriberList = subscribers.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
        for(String subscriber : subscriberList)
            bookService.createUserAccount(subscriber.trim(), password, RoleName.ROLE_SUBSCRIBER);
    }

    public void addBooks() {
        InputStream is = getFileFromResourceAsStream();
        final String password = this.passwordEncoder.encode("12345");

        try (InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);
             BufferedReader reader = new BufferedReader(streamReader)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    String[] splitted = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");

                    String title = splitted[2].replace("\"", "").trim();
                    String authors = splitted[3].replace("\"", "").trim();
                    String publisher = splitted[4].replace("\"", "").trim();
                    String isbn = splitted[5].replace("\"", "").trim();

                    bookService.createUserAccount(splitted[4], password, RoleName.ROLE_PUBLISHER);
                    Book book = bookService.createBook(title,isbn,authors,publisher);
                }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
