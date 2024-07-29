package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

    // 회원가입
    @Insert("""
            INSERT INTO member (id, password, email, nick_name)
            VALUES (#{id}, #{password}, #{email}, #{nickName})
            """)
    int signup(Member member);
}
