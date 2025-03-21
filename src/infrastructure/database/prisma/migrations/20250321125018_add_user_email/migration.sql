-- CreateTable
CREATE TABLE "UserEmail" (
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEmail_email_key" ON "UserEmail"("email");
