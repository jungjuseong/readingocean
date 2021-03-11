package com.clbee.readingocean.payload;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class DownloadResponse {
    private String message;

    public DownloadResponse(String message) {
        this.message = message;
    }
}
