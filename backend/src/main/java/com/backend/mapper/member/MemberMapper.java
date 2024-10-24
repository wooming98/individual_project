package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    // 회원가입
    @Insert("""
            INSERT INTO member (username, password, nick_name)
            VALUES (#{username}, #{password}, #{nickname})
            """)
    int signup(Member member);

    // 아이디로 멤버 정보 가져오기
    @Select("""
            SELECT *
            FROM member
            WHERE username = #{username}
            """)
    Member selectByUsername(String username);

    // 권한 타입 가져오기
    @Select("""
            SELECT authtype
            FROM authority
            WHERE member_index = #{memberIndex}
            """)
    List<String> selectAuthorityByMemberIndex(Integer memberIndex);

    // 해당 닉네임의 멤버가 있는지
    @Select("""
            SELECT *
            FROM member
            WHERE nick_name = #{nickname}
            """)
    Member selectByNickname(String nickname);

    // 회원 정보 수정
    @Update("""
            UPDATE member
            SET nick_name = #{nickname}
            WHERE member_index = #{memberIndex}
            """)
    int update(Member member);

    // 회원 비밀번호 변경
    @Update("""
            UPDATE member
            SET password = #{password}
            WHERE member_index = #{memberIndex}
            """)
    int updatePassword(Member member);

    // 회원 정보 삭제
    @Delete("""
            DELETE FROM member
            WHERE member_index = #{memberIndex}
            """)
    int deleteByMemberIndex(Integer memberIndex);
}
