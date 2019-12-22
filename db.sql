CREATE DATABASE Online_Testing;

CREATE TABLE applicant (
email VARCHAR(200) NOT NULL PRIMARY KEY UNIQUE,
password VARCHAR(50) NOT NULL,
firstname VARCHAR(50) NOT NULL,
lastname VARCHAR(50) NOT NULL,
telephone VARCHAR(50),
cv VARCHAR(800)
);

CREATE TABLE postion (
postionid INT NOT NULL PRIMARY KEY UNIQUE AUTO_INCREMENT,
postionname VARCHAR(200) NOT NULL,
postiondetail VARCHAR(800) NOT NULL
);

CREATE TABLE postion_applicant (
email VARCHAR(200) NOT NULL,
cv VARCHAR(800) NOT NULL,
postionid INT NOT NULL,
postionname VARCHAR(200) NOT NULL,  
FOREIGN KEY (email) REFERENCES applicant(email),
FOREIGN KEY (postionid) REFERENCES postion(postionid)
);

CREATE TABLE exam (
examid INT NOT NULL PRIMARY KEY UNIQUE AUTO_INCREMENT,
examtype VARCHAR(200) NOT NULL
);

CREATE TABLE applicant_postion_exam (
email VARCHAR(200) NOT NULL,
postionid INT NOT NULL,
postionname VARCHAR(200) NOT NULL,
examid INT NOT NULL,
examtype VARCHAR(200) NOT NULL,
deadline Date,
number INT NOT NULL,
FOREIGN KEY (email) REFERENCES applicant(email),
FOREIGN KEY (postionid) REFERENCES postion(postionid),
FOREIGN KEY (examid) REFERENCES exam(examid)
);

CREATE TABLE hr (
email VARCHAR(200) NOT NULL PRIMARY KEY UNIQUE,
password VARCHAR(50) NOT NULL
);

CREATE TABLE questions(
qid INT NOT NULL PRIMARY KEY UNIQUE AUTO_INCREMENT,
question VARCHAR(200) NOT NULL,
examtype VARCHAR(200) NOT NULL,
examid INT NOT NULL,
FOREIGN KEY (examid) REFERENCES exam(examid)
);

CREATE TABLE answers(
aid INT NOT NULL PRIMARY KEY UNIQUE AUTO_INCREMENT,
answer VARCHAR(200) NOT NULL,
correct  VARCHAR(200) NOT NULL,
qid INT NOT NULL,
FOREIGN KEY (qid) REFERENCES questions(qid)
);

CREATE TABLE applicant_exam (
examid INT NOT NULL,
qid INT NOT NULL,
aid INT NOT NULL,
correct  VARCHAR(200) NOT NULL,
email VARCHAR(200) NOT NULL,
question VARCHAR(200) NOT NULL ,
answer VARCHAR(200) NOT NULL,
FOREIGN KEY (examid) REFERENCES exam(examid),
FOREIGN KEY (aid) REFERENCES answers(aid),
FOREIGN KEY (qid) REFERENCES questions(qid),
FOREIGN KEY (email) REFERENCES applicant(email)
);