package com.backend.domain.board;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Board {
    private Integer boardIndex;
    private String title;
    private String content;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate inserted;
    private Integer memberIndex;
    private String nickName;
}
