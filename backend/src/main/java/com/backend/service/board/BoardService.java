package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.member.MemberProfile;
import com.backend.mapper.board.BoardMapper;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
    private final MemberMapper memberMapper;

    // 해당 이미지 URI 앞쪽
    @Value("${image.src.prefix}")
    String srcPrefix;

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
        // 마지막 페이지는 마지막 페이지만 나오게끔
        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);
        // 이전 페이지 ( < )
        Integer prevPageNumber = leftPageNumber - 1;
        // 다음 페이지 ( > )
        Integer nextPageNumber = rightPageNumber + 1;

        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        // 이전버튼, 다음버튼
        if (prevPageNumber > 0) {
            pageInfo.put("prevPageNumber", prevPageNumber);
        }
        if (nextPageNumber <= lastPageNumber) {
            pageInfo.put("nextPageNumber", nextPageNumber);
        }

        // boardList 가져오기
        List<Board> boardList = boardMapper.list(offset);
        // 반복문으로 src 가져오기
        for (Board board : boardList) {
            String name = memberMapper.getProfileImage(board.getMemberIndex());
            String src = String.format(srcPrefix + "member/%s/%s", board.getMemberIndex(), name);
            board.setSrc(src);
        }

        return Map.of("pageInfo", pageInfo,
                "boardList", boardList);
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

    // 글 보기, 프로필 이미지 가져오기
    public Map<String, Object> get(Integer id) {
        // map 객체 만들기
        Map<String, Object> result = new HashMap<>();
        // id로 DB에 있는 board 정보 가져와서 map에 담기
        Board dbBoard = boardMapper.get(id);
        result.put("board", dbBoard);

        // MemberProfile 객체 만들어서 name과 src 입력 후 map에 담기
        MemberProfile memberProfile = new MemberProfile();
        memberProfile.setName(memberMapper.getProfileImage(dbBoard.getMemberIndex()));
        String src = String.format(srcPrefix + "member/%s/%s", dbBoard.getMemberIndex(), memberProfile.getName());
        memberProfile.setSrc(src);
        result.put("profile", memberProfile);

        return result;
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

    // 글 수정
    public void edit(Board board) {
        boardMapper.edit(board);
    }
}
