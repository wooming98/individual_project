package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;

    // 글 목록
    public Map<String, Object> list(Integer page) {
        Map<String, Object> pageInfo = new HashMap<>();
        Integer countAll = boardMapper.countAll();

        Integer offset = (page - 1) * 10;
        Integer lastPageNumber = (countAll - 1) / 10 + 1;
        // 10개의 버튼 중 처음 시작 번호
        Integer leftPageNumber = (page - 1) / 10 * 10 + 1;
        // 10개의 버튼 중 마지막 번호
        Integer rightPageNumber = leftPageNumber + 9;

        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        return Map.of("pageInfo", pageInfo,
                "boardList", boardMapper.list(offset));
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
    public void add(Board board) {

        boardMapper.add(board);
    }

    public Board get(Integer id) {
        return boardMapper.get(id);
    }

    // 접근 권한이 있는지 확인
    public boolean hasAccess(Integer boardIndex, Integer memberIndex) {
        Board board = boardMapper.selectById(boardIndex);

        return board.getMemberIndex().equals(memberIndex);
    }

    // 글 삭제
    public void delete(Integer id) {
        boardMapper.delete(id);
    }

    public void edit(Board board) {
        boardMapper.edit(board);
    }
}
