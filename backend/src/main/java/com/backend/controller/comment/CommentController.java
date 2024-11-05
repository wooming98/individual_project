package com.backend.controller.comment;

import com.backend.domain.comment.Comment;
import com.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    // 댓글 저장
    @PostMapping("add")
    public ResponseEntity addComment(@RequestBody Comment comment, Authentication authentication) {
        if(commentService.validate(comment)) {
            commentService.addComment(comment, authentication);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 해당 게시물 댓글 가져오기
    @GetMapping("list/{boardIndex}")
    public List<Comment> getCommentList(@PathVariable int boardIndex) {
        return commentService.getCommentList(boardIndex);
    }
    
    // 댓글 삭제하기
    @DeleteMapping("delete")
    public ResponseEntity deleteComment(@RequestBody Comment comment) {
        if(commentService.validate(comment)) {
            commentService.deleteComment(comment);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // 댓글 수정하기
    @PutMapping("edit")
    public ResponseEntity editComment(@RequestBody Comment comment) {
        if(commentService.validate(comment)) {
            commentService.editComment(comment);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
