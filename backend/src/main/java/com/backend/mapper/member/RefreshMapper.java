package com.backend.mapper.member;

import com.backend.domain.member.RefreshToken;
import org.apache.ibatis.annotations.*;

@Mapper
public interface RefreshMapper {

    // refresh 토큰 삽입
    @Insert("""
            INSERT INTO refresh_token (username, refresh, expiration)
            VALUES (#{username}, #{refresh}, #{expiration})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertByRefresh(RefreshToken refreshToken);

    // refresh 토큰이 있는지
    @Select("""
            SELECT 1 
            FROM refresh_token 
            WHERE refresh = #{refresh} 
            LIMIT 1
            """)
    Boolean existsByRefresh(String refresh);

    // refresh 토큰 삭제
    @Delete("""
            DELETE FROM refresh_token
            WHERE refresh = #{refresh}
            """)
    int deleteByRefresh(String refresh);
}
