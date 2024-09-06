package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {

    // 회원가입
    @Insert("""
            INSERT INTO member (username, password, nick_name)
            VALUES (#{username}, #{password}, #{nickName})
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
}
