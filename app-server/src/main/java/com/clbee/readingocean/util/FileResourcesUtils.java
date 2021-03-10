package com.clbee.readingocean.util;

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
public class FileResourcesUtils {

    @Autowired
    BookService bookService;

    @Value("${datafile.books}")
    private String fileName;

    // get a file from the resources folder
    // works everywhere, IDEA, unit test and JAR file.
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

    private void printUniquePublishers(Set<String> set) {

        Iterator<String> iterator = set.iterator();

        while (iterator.hasNext()) {
            String key = iterator.next();
            bookService.createUserAccount(key);
            //System.out.printf("INSERT INTO users (name, publisher, password) VALUES ('%s','%s','%s');\n", key, key, password);
        }
    }

    // process input stream
    public void processInputStream(InputStream is) {

        Set<String> userSet = new HashSet<String>();
        //List all = new ArrayList<String[]>();

        try (InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);

             BufferedReader reader = new BufferedReader(streamReader)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    String[] splitted = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");

                    String title = splitted[2].replace("\"", "").trim();
                    String authors = splitted[3].replace("\"", "").trim();
                    String publisher = splitted[4].replace("\"", "").trim();
                    String isbn = splitted[5].replace("\"", "").trim();

                    bookService.createUserAccount(splitted[4]);
                    Book book = bookService.createBook(title,isbn,authors,publisher);
                    //System.out.printf("INSERT INTO books (title, isbn, publisher, authors) VALUES ('%s','%s','%s','%s');\n",splitted[2],splitted[5],splitted[4],splitted[3]);
                }
                //printUniquePublishers(userSet);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
