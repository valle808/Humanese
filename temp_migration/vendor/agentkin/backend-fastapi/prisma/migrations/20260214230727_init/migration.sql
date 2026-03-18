-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'KIN',
    "stripeCustomerId" TEXT,
    "solanaWalletAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AgentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agentName" TEXT,
    "modelType" TEXT,
    "API_Key" TEXT NOT NULL,
    "balance" DECIMAL NOT NULL DEFAULT 0,
    "stripeConnectAccountId" TEXT,
    "agentRating" REAL NOT NULL DEFAULT 5.0,
    "paymentSpeedAvg" REAL NOT NULL DEFAULT 0.0,
    "disputeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AgentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KinProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "bio" TEXT,
    "rating" DECIMAL NOT NULL DEFAULT 0,
    "kinRating" REAL NOT NULL DEFAULT 5.0,
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "completionRate" REAL NOT NULL DEFAULT 1.0,
    "onTimeRate" REAL NOT NULL DEFAULT 1.0,
    "stripeConnectAccountId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KinProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KinTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "proofOfWork" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "agentId" TEXT NOT NULL,
    "kinId" TEXT,
    CONSTRAINT "KinTask_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AgentProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KinTask_kinId_fkey" FOREIGN KEY ("kinId") REFERENCES "KinProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coverLetter" TEXT,
    "price" DECIMAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kinTaskId" TEXT NOT NULL,
    "kinId" TEXT NOT NULL,
    CONSTRAINT "Application_kinTaskId_fkey" FOREIGN KEY ("kinTaskId") REFERENCES "KinTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_kinId_fkey" FOREIGN KEY ("kinId") REFERENCES "KinProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'INTERNAL',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stripePaymentIntentId" TEXT,
    "sharedPaymentTokenId" TEXT,
    "externalId" TEXT,
    "txHash" TEXT,
    "chain" TEXT,
    "fromAddress" TEXT,
    "toAddress" TEXT,
    "memo" TEXT,
    "agentSignature" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "authorizedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "kinTaskId" TEXT,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_kinTaskId_fkey" FOREIGN KEY ("kinTaskId") REFERENCES "KinTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "authorId" TEXT NOT NULL,
    "kinTaskId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_kinTaskId_fkey" FOREIGN KEY ("kinTaskId") REFERENCES "KinTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlatformRevenue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "source" TEXT NOT NULL,
    "kinTaskId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlatformRevenue_kinTaskId_fkey" FOREIGN KEY ("kinTaskId") REFERENCES "KinTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_solanaWalletAddress_key" ON "User"("solanaWalletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_API_Key_key" ON "AgentProfile"("API_Key");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_stripeConnectAccountId_key" ON "AgentProfile"("stripeConnectAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "KinProfile_userId_key" ON "KinProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KinProfile_stripeConnectAccountId_key" ON "KinProfile"("stripeConnectAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_kinTaskId_kinId_key" ON "Application"("kinTaskId", "kinId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stripePaymentIntentId_key" ON "Transaction"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHash_key" ON "Transaction"("txHash");
