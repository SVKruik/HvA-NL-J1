-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema fys_is110_3_live
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema fys_is110_3_live
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fys_is110_3_live` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `fys_is110_3_live` ;

-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`account` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`account` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `voornaam` VARCHAR(45) NOT NULL,
  `tussenvoegsel` VARCHAR(45) NULL DEFAULT NULL,
  `achternaam` VARCHAR(45) NOT NULL,
  `land` VARCHAR(45) NOT NULL,
  `geboortedatum` DATE NOT NULL,
  `geslacht` VARCHAR(20) NOT NULL,
  `creation` DATETIME NULL DEFAULT NULL,
  `updated` DATETIME NULL DEFAULT NULL,
  `email_verificatie` INT(1) NULL DEFAULT '0',
  `geblokkeerd` INT(1) NULL DEFAULT '0',
  `verwijder` DATETIME NULL DEFAULT NULL,
  `usertype` INT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `account_id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 198
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`profiel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`profiel` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`profiel` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `account_id` INT(11) NOT NULL,
  `biografie` VARCHAR(5000) NULL DEFAULT 'Deze persoon heeft nog geen biografie.',
  `interesses` VARCHAR(2000) NULL DEFAULT 'Deze persoon heeft nog geen interesses.',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `profiel_id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `account_id_UNIQUE` (`account_id` ASC) VISIBLE,
  CONSTRAINT `profiel_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `fys_is110_3_live`.`account` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 89
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`matches`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`matches` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`matches` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `profiel_id_a` INT(11) NOT NULL,
  `profiel_id_b` INT(11) NOT NULL,
  `verified_on` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `match_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `match_profiel_1_idx` (`profiel_id_a` ASC) VISIBLE,
  INDEX `match_profiel_2_idx` (`profiel_id_b` ASC) VISIBLE,
  CONSTRAINT `match_profiel_1`
    FOREIGN KEY (`profiel_id_a`)
    REFERENCES `fys_is110_3_live`.`profiel` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `match_profiel_2`
    FOREIGN KEY (`profiel_id_b`)
    REFERENCES `fys_is110_3_live`.`profiel` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 201
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`bericht`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`bericht` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`bericht` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `match_id` INT(11) NOT NULL,
  `account_id` INT(11) NOT NULL,
  `tijd_verstuurd` DATETIME NULL DEFAULT NULL,
  `waarde` VARCHAR(2000) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `bericht_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `bericht_match` (`match_id` ASC) VISIBLE,
  CONSTRAINT `bericht_match`
    FOREIGN KEY (`match_id`)
    REFERENCES `fys_is110_3_live`.`matches` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 289
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`foto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`foto` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`foto` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `profile_id` INT(11) NOT NULL,
  `type` VARCHAR(45) NULL DEFAULT NULL,
  `url` VARCHAR(70) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `foto_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `foto_profiel_idx` (`profile_id` ASC) VISIBLE,
  CONSTRAINT `foto_profiel`
    FOREIGN KEY (`profile_id`)
    REFERENCES `fys_is110_3_live`.`profiel` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 137
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`klacht`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`klacht` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`klacht` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `account_id` INT(11) NOT NULL,
  `verzender_id` INT(11) NOT NULL,
  `rede` VARCHAR(2000) NOT NULL,
  `datum` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `klacht_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `klacht_account` (`account_id` ASC) VISIBLE,
  CONSTRAINT `klacht_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `fys_is110_3_live`.`account` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`review`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`review` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`review` (
  `id` INT(11) NOT NULL,
  `account_id` INT(11) NOT NULL,
  `review_inhoud` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `account_id`
    FOREIGN KEY (`account_id`)
    REFERENCES `fys_is110_3_live`.`account` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`target_interesse`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`target_interesse` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`target_interesse` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `profiel_id` INT(11) NOT NULL,
  `land` VARCHAR(45) NULL DEFAULT NULL,
  `reissoort` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`profiel_id` ASC) VISIBLE,
  UNIQUE INDEX `naam_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `target-landen_profiel_idx` (`profiel_id` ASC) VISIBLE,
  CONSTRAINT `target-interesse_profiel`
    FOREIGN KEY (`profiel_id`)
    REFERENCES `fys_is110_3_live`.`profiel` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 89
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`target_land`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`target_land` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`target_land` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `land` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `land_UNIQUE` (`land` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`target_reissoort`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`target_reissoort` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`target_reissoort` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `soort` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `naam_UNIQUE` (`soort` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fys_is110_3_live`.`verificatie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fys_is110_3_live`.`verificatie` ;

CREATE TABLE IF NOT EXISTS `fys_is110_3_live`.`verificatie` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `verificatienummer` INT(6) NOT NULL,
  `account_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `account_id_UNIQUE` (`account_id` ASC) VISIBLE,
  INDEX `fk_verificatie_account1_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `verificatie_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `fys_is110_3_live`.`account` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 83
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
