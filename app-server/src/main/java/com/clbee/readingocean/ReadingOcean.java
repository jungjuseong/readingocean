package com.clbee.readingocean;

import com.clbee.readingocean.service.BookRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@EntityScan(basePackageClasses = {
		ReadingOcean.class,
		Jsr310JpaConverters.class
})
public class ReadingOcean {

	@Autowired
	BookRegisterService registerService;

	@PostConstruct
	void init() {

		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

		registerService.addUsers();
		registerService.addBooks();
	}

	public static void main(String[] args) {
		SpringApplication.run(ReadingOcean.class, args);
	}
}
