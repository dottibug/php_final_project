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
VALUES (1, 'kanbanUser', 'kanbanUser@email.com',
        '$2y$10$5NAp0d0T3hbmrX.q0uyRW.xhGCrk/JJ7LJ4R.Oe0OjBjSoUll9P0W');

-- Projects table
CREATE TABLE boards
(
    boardID int         NOT NULL AUTO_INCREMENT,
    userID  int         NOT NULL,
    title   varchar(50) NOT NULL,
    PRIMARY KEY (boardID),
    FOREIGN KEY (userID) REFERENCES users (userID)
);

INSERT INTO boards
VALUES (10, 1, 'Blog Website'),
       (11, 1, 'Online Shopping Feature'),
       (12, 1, 'Social Media Campaign');

-- Lists table
CREATE TABLE lists
(
    listID  int         NOT NULL AUTO_INCREMENT,
    boardID int         NOT NULL,
    title   varchar(50) NOT NULL,
    color   varchar(50) DEFAULT '#8471F2',
    PRIMARY KEY (listID),
    FOREIGN KEY (boardID) REFERENCES boards (boardID) ON DELETE CASCADE
);

INSERT INTO lists
VALUES (100, 10, 'todo', '#49C4E5'),
       (101, 10, 'doing', '#8471F2'),
       (102, 10, 'done', '#67E2AE'),
       (103, 11, 'todo', '#49C4E5'),
       (104, 11, 'doing', '#8471F2'),
       (105, 11, 'done', '#67E2AE'),
       (106, 12, 'todo', '#49C4E5'),
       (107, 12, 'doing', '#8471F2'),
       (108, 12, 'done', '#67E2AE');

-- Tasks table
CREATE TABLE tasks
(
    taskID      int          NOT NULL AUTO_INCREMENT,
    boardID     int          NOT NULL,
    listID      int          NOT NULL,
    title       varchar(300) NOT NULL,
    description varchar(2000),
    PRIMARY KEY (taskID),
    FOREIGN KEY (boardID) REFERENCES boards (boardID) ON DELETE CASCADE,
    FOREIGN KEY (listID) REFERENCES lists (listID) ON DELETE CASCADE
);

INSERT INTO tasks
VALUES (1000, 10, 100, 'Optimize SEO',
        'Implement best practices for search engine ranking to increase traffic to the blog.'),
       (1001, 10, 100, 'Implement analytics', 'Get data on user behaviour and conversion rates.'),
       (1002, 10, 100, 'Set up newsletter',
        'Create a newsletter subscription for users to stay engaged with new content.'),
       (1003, 10, 101, 'Create about page', 'Add a page about the content creators.'),
       (1004, 10, 101, 'First blog post', 'Write initial blog post.'),
       (1005, 10, 102, 'Setup hosting', 'Choose and setup web hosting.'),
       (1006, 10, 102, 'Design homepage', 'Design the layout for the homepage.'),
       (1007, 11, 103, 'Product Search and filter', 'Allow users to search and filter products.'),
       (1008, 11, 103, 'Product Review and Rating', 'Allow users to review and rate products.'),
       (1009, 11, 104, 'Shopping cart', 'Implement a shopping cart for users.'),
       (1010, 11, 104, 'Checkout process', 'Create a secure checkout process.'),
       (1011, 11, 105, 'Product listing page', 'Create a page that lists all products for sale.'),
       (1012, 11, 105, 'User authentication', 'Implement user login and registration.'),
       (1013, 12, 106, 'Schedule posts',
        'Schedule promotional posts across social media platforms.'),
       (1014, 12, 107, 'Create promotional content',
        'Design content for social media posts.');

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
VALUES (1, 1000, 'Research keywords', 'unchecked'),
       (2, 1000, 'Update website meta tags', 'unchecked'),
       (3, 1000, 'Implement responsive mobile design', 'unchecked'),
       (4, 1000, 'Check for broken links', 'unchecked'),
       (5, 1001, 'Choose analytics tool', 'unchecked'),
       (6, 1001, 'Integrate into site', 'unchecked'),
       (7, 1002, 'Choose email marketing service', 'unchecked'),
       (8, 1002, 'Design newsletter signup component', 'unchecked'),
       (9, 1002, 'Automate welcome emails', 'unchecked'),
       (10, 1003, 'Write content', 'unchecked'),
       (11, 1003, 'Design layout for page', 'checked'),
       (12, 1003, 'Add team photos and bios', 'unchecked'),
       (13, 1004, 'Outline blog post ideas', 'checked'),
       (14, 1004, 'Write first post', 'unchecked'),
       (15, 1005, 'Research hosting options', 'checked'),
       (16, 1005, 'Purchase hosting plan', 'checked'),
       (17, 1006, 'Homepage wireframe', 'checked'),
       (18, 1006, 'Add CTA for newsletter signup', 'checked'),
       (19, 1006, 'Design site navigation', 'checked'),
       (20, 1007, 'Implement search functionality', 'unchecked'),
       (21, 1007, 'Create filters for product categories', 'unchecked'),
       (22, 1008, 'Design UI for reviews and ratings', 'unchecked'),
       (23, 1008, 'Implement backend for storing reviews', 'unchecked'),
       (24, 1009, 'Design shopping cart UI', 'checked'),
       (25, 1009, 'Implement add to cart functionality', 'unchecked'),
       (26, 1009, 'Integrate product database', 'unchecked'),
       (27, 1009, 'Include taxes and shipping calculations', 'unchecked'),
       (28, 1010, 'Test checkout process', 'unchecked'),
       (29, 1010, 'Implement payment gateway integration', 'unchecked'),
       (30, 1011, 'Design product listing page', 'checked'),
       (31, 1011, 'Develop backend for product listings', 'checked'),
       (32, 1011, 'Add filters and product sorting options', 'checked'),
       (33, 1012, 'Design login and registration pages', 'checked'),
       (34, 1012, 'Develop user authentication backend', 'checked'),
       (35, 1012, 'Add password recovery', 'checked'),
       (36, 1013, 'Choose social media platforms', 'unchecked'),
       (37, 1013, 'Use scheduling tool to set up posts', 'unchecked'),
       (38, 1014, 'Design graphics for posts', 'checked'),
       (39, 1014, 'Write copy for posts', 'unchecked');

-- Create user named kanban_user
GRANT SELECT, INSERT, UPDATE, DELETE
    ON *
    TO kanban_user@localhost
        IDENTIFIED BY 'sesame';