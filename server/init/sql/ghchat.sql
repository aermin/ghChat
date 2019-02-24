# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 5.7.22)
# Database: ghchat
# Generation Time: 2019-02-24 04:02:07 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table group_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_info`;

CREATE TABLE `group_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_group_id` char(100) NOT NULL DEFAULT '',
  `name` varchar(20) NOT NULL DEFAULT '',
  `group_notice` varchar(100) NOT NULL DEFAULT '',
  `avatar` varchar(250) DEFAULT '',
  `creator` varchar(10) NOT NULL DEFAULT '',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table group_msg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_msg`;

CREATE TABLE `group_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL,
  `to_group_id` char(100) NOT NULL DEFAULT '',
  `message` text NOT NULL,
  `time` int(11) NOT NULL,
  `attachments` varchar(250) DEFAULT '''[]''',
  PRIMARY KEY (`id`),
  KEY `to_group` (`to_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table group_user_relation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_user_relation`;

CREATE TABLE `group_user_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_group_id` char(100) NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table private__msg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `private__msg`;

CREATE TABLE `private__msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL,
  `to_user` int(11) NOT NULL,
  `message` text,
  `time` int(11) NOT NULL,
  `attachments` varchar(250) DEFAULT '[]',
  PRIMARY KEY (`id`),
  KEY `from_user` (`from_user`),
  KEY `to_user` (`to_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_info`;

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `github_id` int(11) DEFAULT NULL,
  `name` varchar(20) NOT NULL DEFAULT 'NOT NULL',
  `password` varchar(40) DEFAULT NULL,
  `avatar` varchar(250) DEFAULT '',
  `location` varchar(50) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `socketid` varchar(20) NOT NULL DEFAULT '',
  `website` varchar(50) DEFAULT NULL,
  `github` varchar(50) DEFAULT NULL,
  `intro` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user_user_relation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_user_relation`;

CREATE TABLE `user_user_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL,
  `remark` varchar(10) DEFAULT '',
  `shield` tinyint(1) NOT NULL DEFAULT '0',
  `time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
