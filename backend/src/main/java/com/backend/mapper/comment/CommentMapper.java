package com.backend.mapper.comment;

import com.backend.domain.comment.Comment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentMapper {

    // 댓글 저장
    @Insert("""
            INSERT INTO comment(comment, board_index, member_index)
            VALUES (#{comment}, #{boardIndex}, #{memberIndex})
            """)
    int addComment(Comment comment);
}
