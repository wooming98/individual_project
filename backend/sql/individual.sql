# 멤버 테이블 생성
create table member
(
    member_index int auto_increment primary key,
    id           varchar(30)                          not null,
    password     varchar(255)                         not null,
    email        varchar(30)                          not null,
    nick_name    varchar(30)                          not null,
    inserted     datetime default current_timestamp() not null
);

# 비밀번호 길이 변경
alter table member
    modify password varchar(255);

# 권한 테이블 생성
create table authority
(
    member_index int         not null primary key references member (member_index),
    authtype     varchar(20) not null
);