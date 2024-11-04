package com.backend.domain.comment;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Comment {
    private Integer commentIndex;
    private Integer boardIndex;
    private Integer memberIndex;
    private String comment;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate inserted;
    private String nickname;
}