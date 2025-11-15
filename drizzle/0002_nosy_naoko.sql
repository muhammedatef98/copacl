CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` varchar(255) NOT NULL,
	`deviceName` varchar(255) NOT NULL,
	`deviceType` varchar(50),
	`publicKey` text NOT NULL,
	`lastSyncAt` timestamp,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `devices_deviceId_unique` UNIQUE(`deviceId`)
);
--> statement-breakpoint
CREATE TABLE `syncQueue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` varchar(255) NOT NULL,
	`itemId` int NOT NULL,
	`action` enum('create','update','delete') NOT NULL,
	`encryptedData` text,
	`iv` varchar(255),
	`syncStatus` enum('pending','synced','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`syncedAt` timestamp,
	CONSTRAINT `syncQueue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userKeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`encryptedMasterKey` text NOT NULL,
	`salt` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userKeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `userKeys_userId_unique` UNIQUE(`userId`)
);
