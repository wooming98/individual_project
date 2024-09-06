package com.backend.domain.member;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Member {
    private Integer memberIndex;
    private String username;
    private String password;
    private String nickName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate inserted;
}
