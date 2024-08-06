package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;

    // 글 목록
    public List<Board> list() {
        return boardMapper.list();
    }

    // 글 등록 시 입력값이 null, 공백인 경우 잡아내는 메소드
    public boolean validate(Board board) {
        if (board.getTitle() == null || board.getTitle().isBlank()) {
            return false;
        }
        if (board.getContent() == null || board.getContent().isBlank()) {
            return false;
        }
        return true;
    }

    // 글 등록
    public void add(Board board, Authentication authentication) {
        board.setMemberIndex(Integer.valueOf(authentication.getName()));

        boardMapper.add(board);
    }

    public Board get(Integer id) {
        return boardMapper.get(id);
    }

    // 접근 권한이 있는지 확인
    public boolean hasAccess(Integer id, Authentication authentication) {
        Board board = boardMapper.selectById(id);

        return board.getMemberIndex()
                .equals(Integer.valueOf(authentication.getName()));
    }

    // 글 삭제
    public void delete(Integer id) {
        boardMapper.delete(id);
    }

    public void edit(Board board) {
        boardMapper.edit(board);
    }
}
