# 멤버 테이블 생성
create table member
(
    member_index int auto_increment primary key,
    id           varchar(30)                          not null,
    password     varchar(30)                          not null,
    email        varchar(30)                          not null,
    nick_name    varchar(30)                          not null,
    inserted     datetime default current_timestamp() not null
);

select *
from member;