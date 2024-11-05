package com.backend.mapper.comment;

import com.backend.domain.comment.Comment;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentMapper {

    // 댓글 저장
    @Insert("""
            INSERT INTO comment(comment, board_index, member_index)
            VALUES (#{comment}, #{boardIndex}, #{memberIndex})
            """)
    int addComment(Comment comment);

    // 해당 게시물 댓글 가져오기
    @Select("""
            SELECT c.comment, c.comment_index, c.inserted, c.member_index, m.nick_name
            FROM comment c JOIN member m ON c.member_index = m.member_index
            WHERE board_index = #{boardIndex}
            ORDER BY comment_index;
            """)
    List<Comment> getCommentList(int boardIndex);

    @Delete("""
            DELETE FROM comment
            WHERE comment_index = #{commentIndex}
            """)
    int deleteComment(Comment comment);
}
