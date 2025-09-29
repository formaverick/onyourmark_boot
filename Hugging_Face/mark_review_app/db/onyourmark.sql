CREATE DATABASE onyourmark DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

show databases;

use onyourmark;

show tables;

desc users;
desc board_post;
desc board_repost;
desc notice;
desc notice_img;
desc review;
desc review_img;

select * from users;
select * from board_post;
select * from board_repost;
select * from notice;
select * from notice_img;

update users set role = "ADMIN" where userid = "jooyeani";
delete from users where userid = "tester";
delete from board_post where member_id = 13;

update board_repost set content = "관리자 답변 내용 입니다." where board_id = 7;

UPDATE notice_img
SET img_url = CONCAT('http://localhost:8080', img_url)
WHERE notice_img_id > 0;

CREATE TABLE REVIEW (
	review_id bigint auto_increment primary key,
    member_id bigint not null,
    content varchar(1000) not null,
    sentiment int not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_users FOREIGN KEY (member_id) REFERENCES users(member_id)
);

CREATE TABLE review_img (
	review_img_id bigint auto_increment primary key,
    review_id bigint not null,
    img_name varchar(255) not null,
    ori_img_name varchar(255) not null,
    img_url varchar(500) not null,
    CONSTRAINT fk_review_img FOREIGN KEY (review_id) REFERENCES review(review_id)
);