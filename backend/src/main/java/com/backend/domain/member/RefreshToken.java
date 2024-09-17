package com.backend.domain.member;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class RefreshToken {
    private Integer id;
    private String username;
    private String refresh;
    private Timestamp expiration;
}
