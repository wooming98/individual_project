package com.backend.controller.board;

import com.backend.domain.board.Board;
import com.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService boardService;

    // 글 목록
    @GetMapping("list")
    public List<Board> list() {
        return boardService.list();
    }

    // 글 작성
    @PostMapping("add")
    // 메서드 호출 전에 로그인 여부 확인
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity add(@RequestBody Board board, Authentication authentication) {
        if (boardService.validate(board)) {
            boardService.add(board, authentication);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}