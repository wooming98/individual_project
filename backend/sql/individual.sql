# 멤버 테이블 생성
create table member
(
    member_index int auto_increment primary key,
    username           varchar(30)                          not null,
    password     varchar(255)                         not null,
    nick_name    varchar(30)                          not null,
    inserted     datetime default current_timestamp() not null
);

# 비밀번호 길이 변경
alter table member
    modify password varchar(255);


# 권한 테이블 생성
# create table authority
# (
#     member_index int         not null primary key references member (member_index),
#     authtype     varchar(20) not null
# );


# 보드 테이블 생성
create table board
(
    board_index  int                                  not null auto_increment primary key,
    member_index int                                  not null references member (member_index),
    title        varchar(100)                         not null,
    content      varchar(10000)                       not null,
    inserted     datetime default current_timestamp() not null
);

select *
from board;

update board
set member_index = 2
where board_index = 4;

insert into board(title, content)
values ('제목이야', '내용이야2')