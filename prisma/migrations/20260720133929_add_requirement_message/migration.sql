-- CreateTable
CREATE TABLE "RequirementMessage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequirementMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequirementMessage" ADD CONSTRAINT "RequirementMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
