-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonitorTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'twitter',
    "twitterHandle" TEXT,
    "weiboHandle" TEXT,
    "keywords" TEXT,
    "minLikes" INTEGER,
    "minRetweets" INTEGER,
    "notifyChannels" TEXT,
    "phoneNumbers" TEXT,
    "webhooks" TEXT,
    "emails" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheckedAt" DATETIME,
    "lastTweetId" TEXT,
    "totalNotifications" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonitorTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MonitorTask" ("createdAt", "emails", "id", "isActive", "keywords", "lastCheckedAt", "lastTweetId", "minLikes", "minRetweets", "notifyChannels", "phoneNumbers", "totalNotifications", "twitterHandle", "updatedAt", "userId", "webhooks") SELECT "createdAt", "emails", "id", "isActive", "keywords", "lastCheckedAt", "lastTweetId", "minLikes", "minRetweets", "notifyChannels", "phoneNumbers", "totalNotifications", "twitterHandle", "updatedAt", "userId", "webhooks" FROM "MonitorTask";
DROP TABLE "MonitorTask";
ALTER TABLE "new_MonitorTask" RENAME TO "MonitorTask";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
