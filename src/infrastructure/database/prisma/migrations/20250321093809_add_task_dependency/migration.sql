-- CreateTable
CREATE TABLE "TaskDependency" (
    "taskId" INTEGER NOT NULL,
    "dependOnTaskId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskDependency_taskId_dependOnTaskId_key" ON "TaskDependency"("taskId", "dependOnTaskId");

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependOnTaskId_fkey" FOREIGN KEY ("dependOnTaskId") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
