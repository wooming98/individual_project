package com.backend.service.comment;

import com.backend.domain.board.Board;
import com.backend.domain.comment.Comment;
import com.backend.mapper.comment.CommentMapper;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;
    private final MemberMapper memberMapper;

    // 해당 이미지 URI 앞쪽
    @Value("${image.src.prefix}")
    String srcPrefix;

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
        List<Comment> commentList = commentMapper.getCommentList(boardIndex);
        // 반복문으로 src 가져오기
        for (Comment comment : commentList) {
            String name = memberMapper.getProfileImage(comment.getMemberIndex());
            String src = String.format(srcPrefix + "member/%s/%s", comment.getMemberIndex(), name);
            comment.setSrc(src);
        }

        return commentList;
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
