-- test schema
CREATE TABLE IF NOT EXISTS
    `user`(
    `username` TEXT,
    `email` TEXT,
    `password` TEXT,
    `fname` TEXT,
    `lname` TEXT
    );

-- production schema
CREATE TABLE IF NOT EXISTS
    `user`(
    `id` INTIGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `fname` VARCHAR(50) NOT NULL,
    `lname` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
    );
    



