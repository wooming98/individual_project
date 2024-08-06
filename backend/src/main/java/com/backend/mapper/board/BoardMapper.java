package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {
    @Select("""
            SELECT b.board_index, b.title, b.inserted ,m.nick_name
            FROM board b join member m on b.member_index = m.member_index
            ORDER BY b.inserted DESC
            """)
    List<Board> list();

    @Insert("""
            INSERT INTO board (title, content, member_index)
            VALUES(#{title}, #{content}, #{memberIndex})
            """)
    int add(Board board);

    @Select("""
            SELECT b.board_index, b.title, b.content, b.inserted ,m.nick_name, m.member_index
            FROM board b join member m on b.member_index = m.member_index
            WHERE board_index = #{boardIndex}
            """)
    Board get(Integer id);
}
