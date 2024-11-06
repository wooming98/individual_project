# 멤버 테이블 생성
create table member
(
    member_index int auto_increment primary key,
    username           varchar(30)                          not null,
    password     varchar(255)                         not null,
    nick_name    varchar(30)                          not null,
    inserted     datetime default current_timestamp() not null
);

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

# refresh 테이블 생성
CREATE TABLE refresh_token
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    username   VARCHAR(255) NOT NULL,
    refresh    VARCHAR(512) NOT NULL UNIQUE,
    expiration TIMESTAMP    NOT NULL
);

# 프로필 이미지 테이블 생성
create table profile_image(
    profile_index int not null auto_increment primary key,
    member_index int not null references member(member_index),
    profile_name varchar(1000)
);

# 댓글 테이블 생성
create table comment
(
    comment_index  int not null auto_increment primary key,
    board_index    int not null,
    member_index int not null,
    comment    varchar(1000) not null,
    inserted datetime default current_timestamp() not null,
    constraint FK_Member_TO_Comment_1
        foreign key (member_index) references member (member_index) on delete cascade,
    constraint FK_Post_TO_Comment_1
        foreign key (board_index) references board (board_index) on delete cascade
);

INSERT INTO board
(title, content, member_index)
SELECT title, content, member_index
FROM board;