package com.clbee.readingocean.service;

import com.clbee.readingocean.exception.AppException;
import com.clbee.readingocean.model.Book;
import com.clbee.readingocean.model.Role;
import com.clbee.readingocean.model.RoleName;
import com.clbee.readingocean.model.User;
import com.clbee.readingocean.repository.BookRepository;
import com.clbee.readingocean.repository.RoleRepository;
import com.clbee.readingocean.repository.UserRepository;
import com.clbee.readingocean.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

@Component
public class BookRegister {

    @Autowired
    BookService bookService;

    @Autowired
    PasswordEncoder encoder;

    @Value("${datafile.books}")
    private String fileName;

    @Value("${users.admin}")
    private String admins;

    @Value("${users.subscriber}")
    private String subscribers;

    // get a file from the resources folder
    public InputStream getFileFromResourceAsStream() {
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
        final String password = encoder.encode("54321");
        String[] adminList = admins.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
        for(String admin : adminList)
            bookService.createUserAccount(admin.trim(), password, RoleName.ROLE_ADMIN);

        String[] subscriberList = subscribers.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
        for(String subscriber : subscriberList)
            bookService.createUserAccount(subscriber.trim(), password, RoleName.ROLE_SUBSCRIBER);
    }

    public void addBooks() {
        InputStream is = getFileFromResourceAsStream();
        final String password = encoder.encode("12345");

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
