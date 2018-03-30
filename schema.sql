DROP DATABASE IF EXISTS nodezon;

CREATE DATABASE nodezon;

USE nodezon;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
    item VARCHAR(100),
    department VARCHAR(100),
    price INT(10),
	quantity INT(10),
    PRIMARY KEY (id)
);
