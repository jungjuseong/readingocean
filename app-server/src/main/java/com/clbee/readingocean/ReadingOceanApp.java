package com.clbee.readingocean;

import com.clbee.readingocean.util.FileResourcesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.InputStream;
import java.util.TimeZone;

import static com.clbee.readingocean.util.FileResourcesUtils.*;

@SpringBootApplication
@EntityScan(basePackageClasses = {
		ReadingOceanApp.class,
		Jsr310JpaConverters.class
})
public class ReadingOceanApp {

	@Autowired
	FileResourcesUtils resourceUtil;

	@PostConstruct
	void init() {

		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

		// FileResourcesUtils resourceUtil = new FileResourcesUtils(fileName);
		InputStream is = resourceUtil.getFileFromResourceAsStream();
		resourceUtil.processInputStream(is);
	}

	public static void main(String[] args) {
		SpringApplication.run(ReadingOceanApp.class, args);
	}
}
