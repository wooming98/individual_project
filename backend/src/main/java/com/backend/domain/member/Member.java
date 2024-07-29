package com.backend.domain.member;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Member {
    private Integer memberIndex;
    private String id;
    private String password;
    private String email;
    private String nickName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate inserted;
}
