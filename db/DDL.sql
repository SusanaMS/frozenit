-- CREATE DATABASE

DROP DATABASE IF EXISTS frozenit;

CREATE DATABASE frozenit;

CREATE TABLE frozenit.users (
  email VARCHAR(100) PRIMARY KEY NOT NULL,
  pass VARCHAR(6) NOT NULL,
  username VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NULL,
  phone VARCHAR(12) NULL,
  subscribe BOOLEAN DEFAULT FALSE,
  avatar BLOB NULL,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  INDEX email_idx (email)
) ENGINE=INNODB;

CREATE TABLE frozenit.freezer (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  users_email VARCHAR(100) NOT NULL,
  name_freezer VARCHAR(50) NOT NULL DEFAULT "MY FREEZER",
  brand VARCHAR(50) NULL,
  model VARCHAR(50) NULL,
  stars TINYINT NULL,
  slots TINYINT NOT NULL DEFAULT 3,
  notes VARCHAR(500) NULL,
  FOREIGN KEY (users_email)
     REFERENCES frozenit.users(email)
     ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE frozenit.categories (
name_category VARCHAR(50) UNIQUE NOT NULL,
expiration_days MEDIUMINT NOT NULL,
remarks TEXT NULL,
FULLTEXT(name_category, remarks)
) ENGINE=INNODB;

CREATE TABLE frozenit.foods (
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
name_food VARCHAR(50) UNIQUE NOT NULL,
categories_name_category VARCHAR(50),
remarks TEXT NULL,
FULLTEXT(name_food, remarks),
  FOREIGN KEY (categories_name_category)
     REFERENCES frozenit.categories(name_category)
     ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE frozenit.records (
id_record INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
users_email VARCHAR(100) NOT NULL,
freezer_id INT NOT NULL,
foods_id INT NOT NULL,
slot TINYINT NULL,
add_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
expiration_date  DATETIME NOT NULL,
update_date DATETIME ON UPDATE CURRENT_TIMESTAMP,
is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
qr BLOB NULL,
  FOREIGN KEY (users_email)
     REFERENCES frozenit.users(email)
     ON DELETE CASCADE,
  FOREIGN KEY (freezer_id)
     REFERENCES frozenit.freezer(id)
     ON DELETE CASCADE,
  FOREIGN KEY (foods_id)
     REFERENCES frozenit.foods(id)
     ON DELETE CASCADE
) ENGINE=INNODB;
