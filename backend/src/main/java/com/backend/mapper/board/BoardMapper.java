package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {
    @Select("""
            SELECT b.board_index, b.title, m.nick_name
            FROM board b join member m on b.member_index = m.member_index
            """)
    List<Board> list();

    @Insert("""
            INSERT INTO board (title, content, member_index)
            VALUES(#{title}, #{content}, #{memberIndex})
            """)
    int add(Board board);
}
