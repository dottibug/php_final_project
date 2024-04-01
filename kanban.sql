-- Create the kanban database
DROP DATABASE IF EXISTS kanban;
CREATE DATABASE kanban;
USE kanban;

-- Users table
CREATE TABLE users
(
    userID   int          NOT NULL AUTO_INCREMENT,
    username varchar(50)  NOT NULL UNIQUE,
    email    varchar(50)  NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    PRIMARY KEY (userID)
);

-- Hashed password: sesame
INSERT INTO users
VALUES (1, 'blogCreator', 'blogcreator@email.com',
        '$2y$10$5NAp0d0T3hbmrX.q0uyRW.xhGCrk/JJ7LJ4R.Oe0OjBjSoUll9P0W'),
       (2, 'shopFeature', 'shopFeature@email.com',
        '$2y$10$5NAp0d0T3hbmrX.q0uyRW.xhGCrk/JJ7LJ4R.Oe0OjBjSoUll9P0W'),
       (3, 'newUser', 'newUser@email.com',
        '$2y$10$5NAp0d0T3hbmrX.q0uyRW.xhGCrk/JJ7LJ4R.Oe0OjBjSoUll9P0W');


-- Projects table
CREATE TABLE boards
(
    boardID int         NOT NULL AUTO_INCREMENT,
    userID  int         NOT NULL,
    title   varchar(24) NOT NULL,
    PRIMARY KEY (boardID),
    FOREIGN KEY (userID) REFERENCES users (userID)
);

INSERT INTO boards
VALUES (10, 1, 'Blog Website'),
       (11, 2, 'Online Shopping Feature'),
       (12, 2, 'Social Media Campaign');

-- Lists table
CREATE TABLE lists
(
    listID  int         NOT NULL AUTO_INCREMENT,
    boardID int         NOT NULL,
    title   varchar(24) NOT NULL,
    color   varchar(50) DEFAULT '#8471F2',
    PRIMARY KEY (listID),
    FOREIGN KEY (boardID) REFERENCES boards (boardID) ON DELETE CASCADE
);

INSERT INTO lists
VALUES (100, 10, 'todo', DEFAULT),
       (101, 11, 'todo', '#49C4E5'),
       (102, 11, 'doing', '#8471F2'),
       (103, 11, 'done', '#67E2AE'),
       (104, 12, 'todo', '#49C4E5'),
       (105, 12, 'doing', '#8471F2'),
       (106, 12, 'done', '#67E2AE');

-- Tasks table (priority: 1 = high, 2 = med, 3 = low)
CREATE TABLE tasks
(
    taskID       int          NOT NULL AUTO_INCREMENT,
    boardID      int          NOT NULL,
    listID       int          NOT NULL,
    title        varchar(300) NOT NULL,
    description  varchar(2000),
    dueDate      date,
    dateComplete date,
    priority     ENUM ('1', '2', '3') DEFAULT '3',
    PRIMARY KEY (taskID),
    FOREIGN KEY (boardID) REFERENCES boards (boardID) ON DELETE CASCADE,
    FOREIGN KEY (listID) REFERENCES lists (listID) ON DELETE CASCADE
);

INSERT INTO tasks
VALUES (1000, 10, 100, 'Setup hosting', 'Choose and setup web hosting.', '2024-05-01 ', null, '1'),
       (1001, 10, 100, 'Design homepage', 'Design the layout for the homepage.', '2024-05-09',
        null, '2'),
       (1002, 10, 100, 'First blog post', 'Write initial blog post.', '2024-05-20', null, '3'),
       (1003, 11, 103, 'Product listing page', 'Create a page that lists all products for sale.',
        '2024-03-03', '2024-03-02', '1'),
       (1004, 11, 102, 'Shopping cart', 'Implement a shopping cart for users.', '2024-03-20',
        null, '1'),
       (1005, 11, 102, 'Checkout process', 'Create a secure checkout process.', '2024-03-30',
        null, '1'),
       (1006, 11, 103, 'User authentication', 'Implement user login and registration.',
        '2024-03-25', '2024-03-25', '2'),
       (1007, 11, 101, 'Product Search and filter', 'Allow users to search and filter products.',
        '2024-03-10', null, '3'),
       (1008, 11, 101, 'Product Review and Rating', 'Allow users to review and rate products.',
        '2024-04-05', null, '3'),
       (1009, 12, 105, 'Create promotional content',
        'Design content for social media posts.', '2024-03-10', null, '1'),
       (1010, 12, 104, 'Schedule posts',
        'Schedule promotional posts across social media platforms.', '2024-03-20', null, '2');

-- Subtasks table
CREATE TABLE subtasks
(
    subtaskID   int          NOT NULL AUTO_INCREMENT,
    taskID      int          NOT NULL,
    description varchar(300) NOT NULL,
    status      ENUM ('checked', 'unchecked'),
    PRIMARY KEY (subtaskID),
    FOREIGN KEY (taskID) REFERENCES tasks (taskID) ON DELETE CASCADE
);

INSERT INTO subtasks
VALUES (1, 1000, 'Research hosting options', 'checked'),
       (2, 1000, 'Purchase hosting plan', 'unchecked'),
       (3, 1001, 'Sketch homepage layout', 'unchecked'),
       (4, 1001, 'Design review', 'unchecked'),
       (5, 1002, 'Outline blog post ideas', 'unchecked'),
       (6, 1002, 'Write first post', 'unchecked'),
       (7, 1003, 'Design product listing page', 'checked'),
       (8, 1003, 'Develop backend for product listings', 'checked'),
       (9, 1004, 'Design shopping cart UI', 'checked'),
       (10, 1004, 'Implement add to cart functionality', 'unchecked'),
       (11, 1005, 'Implement payment gateway integration', 'unchecked'),
       (12, 1005, 'Test checkout process', 'unchecked'),
       (13, 1006, 'Design login and registration pages', 'checked'),
       (14, 1006, 'Develop user authentication backend', 'checked'),
       (15, 1007, 'Implement search functionality', 'unchecked'),
       (16, 1007, 'Create filters for product categories', 'unchecked'),
       (17, 1008, 'Design UI for reviews and ratings', 'unchecked'),
       (18, 1008, 'Implement backend for storing reviews', 'unchecked'),
       (19, 1009, 'Design graphics for posts', 'checked'),
       (20, 1009, 'Write copy for posts', 'unchecked'),
       (21, 1010, 'Choose social media platforms', 'unchecked'),
       (22, 1010, 'Use scheduling tool to set up posts', 'unchecked');

-- Create user named kanban_user
GRANT SELECT, INSERT, UPDATE, DELETE
    ON *
    TO kanban_user@localhost
        IDENTIFIED BY 'sesame';