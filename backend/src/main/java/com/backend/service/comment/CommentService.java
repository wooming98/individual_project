package com.backend.service.comment;

import com.backend.domain.comment.Comment;
import com.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;

    // comment 객체가 null인지 검증
    public boolean validate(Comment comment) {
        if(comment == null) {
            return false;
        }
        return true;
    }

    // 댓글 저장
    public void addComment(Comment comment, Authentication authentication) {
        commentMapper.addComment(comment);
    }

    // 해당 게시물의 댓글 가져오기
    public List<Comment> getCommentList(int boardIndex) {
        return commentMapper.getCommentList(boardIndex);
    }

    // 댓글 삭제
    public void deleteComment(Comment comment) {
        commentMapper.deleteComment(comment);
    }

    // 댓글 수정
    public void editComment(Comment comment) {
        commentMapper.editComment(comment);
    }

    // 해당 기시물의 댓글 수 가져오기
    public int getCommentCount(int boardIndex) {
        return commentMapper.getCommentCount(boardIndex);
    }
}
