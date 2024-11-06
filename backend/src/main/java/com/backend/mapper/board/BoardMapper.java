package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {
    // 게시글 목록
    @Select("""
            SELECT b.board_index, b.title, b.inserted ,m.nick_name, m.member_index, COUNT(c.comment_index) AS comment_count
            FROM board b JOIN member m ON b.member_index = m.member_index
                         LEFT JOIN comment c ON b.board_index = c.board_index
            GROUP BY b.board_index, b.title, b.inserted ,m.nick_name, m.member_index
            ORDER BY b.inserted DESC
            LIMIT #{offset}, 10
            """)
    List<Board> list(Integer offset);

    // 게시글 등록
    @Insert("""
            INSERT INTO board (title, content, member_index)
            VALUES(#{title}, #{content}, #{memberIndex})
            """)
    int add(Board board);

    // 게시글 보기
    @Select("""
            SELECT b.board_index, b.title, b.content, b.inserted ,m.nick_name, m.member_index
            FROM board b join member m on b.member_index = m.member_index
            WHERE board_index = #{boardIndex}
            """)
    Board get(Integer id);

    // 해당 아이디로 board 가져오기
    @Select("""
            SELECT *
            FROM board
            WHERE board_index = #{id}
            """)
    Board selectById(Integer id);

    // 해당 아이디 게시물 삭제
    @Delete("""
            DELETE 
            FROM board
            WHERE board_index = #{id}
            """)
    int delete(Integer id);

    // 해당 게시물 수정
    @Update("""
            UPDATE board
            SET title=#{title}, content=#{content}
            WHERE board_index = #{boardIndex}
            """)
    int edit(Board board);

    @Select("""
            SELECT COUNT(*) FROM board
            """)
    Integer countAll();
}
