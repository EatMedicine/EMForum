IF EXISTS (SELECT * FROM sys.databases WHERE name = 'EMForum')  
DROP DATABASE EMForum
GO
CREATE DATABASE EMForum
GO

USE EMForum
GO

IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'areaInfo')
DROP TABLE areaInfo
GO
CREATE TABLE areaInfo
(
	areaId INT PRIMARY KEY IDENTITY(1, 1),
	name NVARCHAR(50),
	isEnable INT, --0关闭 1启用
)
GO

IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'userInfo')
DROP TABLE userInfo
GO
CREATE TABLE userInfo
(
	userId INT PRIMARY KEY IDENTITY(1, 1),
	name NVARCHAR(50),
	isEnable INT, --0关闭 1启用
)
GO

IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'articleInfo')
DROP TABLE articleInfo
GO
CREATE TABLE articleInfo
(
	articleId INT PRIMARY KEY IDENTITY(1, 1),
	userId INT FOREIGN KEY REFERENCES userInfo(userId),
	areaId INT FOREIGN KEY REFERENCES areaInfo(areaId),
	title NVARCHAR(200),
	content TEXT,
	visitedNum INT,
	isEnable INT, --0关闭 1启用
)
GO