package com.backend.controller.board;

import com.backend.domain.board.Board;
import com.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService boardService;

    // 글 목록
    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") Integer page) {
        return boardService.list(page);
    }

    // 글 작성
    @PostMapping("add")
    // 메서드 호출 전에 로그인 여부 확인
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity add(@RequestBody Board board) {
        if (boardService.validate(board)) {
            boardService.add(board);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // 글 보기
    @GetMapping("{id}")
    public ResponseEntity get(@PathVariable Integer id) {

        Map<String, Object> board = boardService.get(id);

        if (board == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(board);
    }

    // 글 삭제
    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable Integer id, @RequestParam Integer memberIndex) {
        if (boardService.hasAccess(id, memberIndex)) {
            boardService.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    // 글 수정
    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity update(@RequestBody Board board, @RequestParam Integer memberIndex) {
        if (!boardService.hasAccess(board.getBoardIndex(), memberIndex)) {
            return ResponseEntity.badRequest().build();
        }
        if (boardService.validate(board)) {
            boardService.edit(board);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
