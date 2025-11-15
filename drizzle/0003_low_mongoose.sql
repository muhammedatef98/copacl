CREATE TABLE `folders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(20) DEFAULT '#8b5cf6',
	`icon` varchar(50),
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `folders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `clipboardItems` ADD `folderId` int;