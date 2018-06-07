# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 5.6.35)
# Database: airchat
# Generation Time: 2018-02-23 10:14:21 +0000
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
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群id',
  `group_id` char(100) NOT NULL,
  `group_name` varchar(20) NOT NULL DEFAULT '交流群' COMMENT '群名称',
  `group_notice` varchar(100) NOT NULL DEFAULT '欢迎大家入群交流~' COMMENT '群公告',
  `group_avator` varchar(50) NOT NULL DEFAULT 'http://ooytyiziz.bkt.clouddn.com/peoples1.jpg' COMMENT '群头像',
  `group_creater` varchar(10) NOT NULL DEFAULT '' COMMENT '群创建人',
  `creater_time` int(11) NOT NULL COMMENT '群创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `group_info` WRITE;
/*!40000 ALTER TABLE `group_info` DISABLE KEYS */;

INSERT INTO `group_info` (`id`, `group_id`, `group_name`, `group_notice`, `group_avator`, `group_creater`, `creater_time`)
VALUES
	(1,'8eeccfc0-0f1e-11e8-892e-5ba8fc68dc36','交流群','交流群','http://ooytyiziz.bkt.clouddn.com/peoples1.jpg','罗宾',1518348455);

/*!40000 ALTER TABLE `group_info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table group_msg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_msg`;

CREATE TABLE `group_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL COMMENT '谁发的',
  `to_group` char(100) NOT NULL DEFAULT '' COMMENT '群id',
  `message` text NOT NULL COMMENT '聊天信息',
  `time` int(11) NOT NULL COMMENT '发送时间',
  PRIMARY KEY (`id`),
  KEY `to_group` (`to_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `group_msg` WRITE;
/*!40000 ALTER TABLE `group_msg` DISABLE KEYS */;

INSERT INTO `group_msg` (`id`, `from_user`, `to_group`, `message`, `time`)
VALUES
	(1,1,'8eeccfc0-0f1e-11e8-892e-5ba8fc68dc36','路飞 : 有人不？',1518348482),
	(2,14,'8eeccfc0-0f1e-11e8-892e-5ba8fc68dc36','罗宾 : 有呀  我呀',1518348493);

/*!40000 ALTER TABLE `group_msg` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table group_user_relation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_user_relation`;

CREATE TABLE `group_user_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` char(100) NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `group_user_relation` WRITE;
/*!40000 ALTER TABLE `group_user_relation` DISABLE KEYS */;

INSERT INTO `group_user_relation` (`id`, `group_id`, `user_id`)
VALUES
	(2,'8eeccfc0-0f1e-11e8-892e-5ba8fc68dc36',1),
	(3,'8eeccfc0-0f1e-11e8-892e-5ba8fc68dc36',14);

/*!40000 ALTER TABLE `group_user_relation` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table new_friends
# ------------------------------------------------------------

DROP TABLE IF EXISTS `new_friends`;

CREATE TABLE `new_friends` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL COMMENT '主动加方',
  `to_user` int(11) NOT NULL COMMENT '被加方',
  `content` varchar(50) NOT NULL DEFAULT '' COMMENT '加好友验证内容',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1同意，0未同意',
  `time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `new_friends` WRITE;
/*!40000 ALTER TABLE `new_friends` DISABLE KEYS */;

INSERT INTO `new_friends` (`id`, `from_user`, `to_user`, `content`, `status`, `time`)
VALUES
	(1,14,1,'您好，我想加您为好友',1,1518348301),
	(2,1,14,'咋把我删了呢',1,1518349582),
	(3,1,14,'您好，我想加您为好友',1,1518350494),
	(4,1,14,'您好，我想加您为好友',1,1518350921),
	(5,1,14,'咋把我删了呢，重新加一下',1,1518351200),
	(6,14,1,'您好，我想加您为好友',1,1518485362),
	(7,14,1,'您好，我想加您为好友',1,1518745791);

/*!40000 ALTER TABLE `new_friends` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table private__msg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `private__msg`;

CREATE TABLE `private__msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL COMMENT '谁发的',
  `to_user` int(11) NOT NULL COMMENT '发给谁',
  `message` text NOT NULL COMMENT '聊天信息',
  `time` int(11) NOT NULL COMMENT '发送时间',
  PRIMARY KEY (`id`),
  KEY `from_user` (`from_user`),
  KEY `to_user` (`to_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `private__msg` WRITE;
/*!40000 ALTER TABLE `private__msg` DISABLE KEYS */;

INSERT INTO `private__msg` (`id`, `from_user`, `to_user`, `message`, `time`)
VALUES
	(1,1,14,'路飞 : 你好罗宾',1518348322),
	(2,14,1,'罗宾 : 你好呀路飞',1518348331),
	(3,14,1,'罗宾 : 我建个群去 ，你待会加哈    叫 交流群',1518348364),
	(6,1,14,'路飞 : 咋把我删了呢，重新加一下',1518351218),
	(7,14,1,'罗宾 : 额 误删.',1518351226),
	(8,14,1,'罗宾 : 在么',1519377863);

/*!40000 ALTER TABLE `private__msg` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_info`;

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT 'NOT NULL' COMMENT '用户名',
  `password` varchar(40) NOT NULL DEFAULT 'NOT NULL' COMMENT '密码',
  `sex` varchar(2) NOT NULL DEFAULT '男' COMMENT '性别',
  `avator` varchar(100) NOT NULL DEFAULT 'http://ooytyiziz.bkt.clouddn.com/people5.jpg' COMMENT '头像',
  `place` varchar(50) DEFAULT NULL COMMENT '来自哪里',
  `last_login` int(10) NOT NULL COMMENT '最后登陆时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '在线状态,0离线,1在线',
  `socketid` varchar(20) NOT NULL DEFAULT '' COMMENT '登陆时的socketid',
  `website` varchar(50) DEFAULT NULL COMMENT '个人网站',
  `github` varchar(50) DEFAULT NULL,
  `intro` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;

INSERT INTO `user_info` (`id`, `name`, `password`, `sex`, `avator`, `place`, `last_login`, `status`, `socketid`, `website`, `github`, `intro`)
VALUES
	(1,'路飞','6512bd43d9caa6e02c990b0a82652dca','男','http://ooytyiziz.bkt.clouddn.com/people1.jpg','厦门',0,0,'tIckUQsrpFm_Wki0AAAF','','https://github.com/Hxvin',NULL),
	(2,'索隆','b6d767d2f8ed5d21a44b0e5886680cb9','男','http://ooytyiziz.bkt.clouddn.com/people2.jpg','深圳',0,0,'l12EoQ8PbnmvupNQAAAP',NULL,'',NULL),
	(3,'乔治','182be0c5cdcd5072bb1864cdee4d3d6e','女','http://ooytyiziz.bkt.clouddn.com/people3.jpg','杭州',0,0,'ue0dCyN0zAyJurW-AABQ',NULL,NULL,NULL),
	(4,'罗','f7177163c833dff4b38fc8d2872f1ec6','女','http://ooytyiziz.bkt.clouddn.com/people4.jpg','',0,0,'67kamGg8ibMLEjpZAAAD',NULL,NULL,NULL),
	(14,'罗宾','b6d767d2f8ed5d21a44b0e5886680cb9','女','http://ooytyiziz.bkt.clouddn.com/people6.jpg',NULL,0,0,'9sictmm25dBk8tj2AAAC',NULL,NULL,NULL);

/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_user_relation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_user_relation`;

CREATE TABLE `user_user_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户',
  `other_user_id` int(11) NOT NULL COMMENT '用户的朋友',
  `remark` varchar(10) DEFAULT '' COMMENT '备注',
  `shield` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0不屏蔽 1屏蔽',
  `time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_user_relation` WRITE;
/*!40000 ALTER TABLE `user_user_relation` DISABLE KEYS */;

INSERT INTO `user_user_relation` (`id`, `user_id`, `other_user_id`, `remark`, `shield`, `time`)
VALUES
	(1,1,14,'网友',0,1518348308),
	(2,14,1,'23333',0,1518745801);

/*!40000 ALTER TABLE `user_user_relation` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
