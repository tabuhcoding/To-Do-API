-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'INPROGRESS', 'INPREVIEW', 'CANCEL', 'COMPLETE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tasks_dueDate_idx" ON "Tasks"("dueDate");

-- CreateIndex
CREATE INDEX "Tasks_status_idx" ON "Tasks"("status");

-- CreateIndex
CREATE INDEX "Tasks_priority_idx" ON "Tasks"("priority");
