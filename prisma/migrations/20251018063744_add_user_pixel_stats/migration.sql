-- CreateTable
CREATE TABLE "PixelStats" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PixelStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PixelStats_userId_date_key" ON "PixelStats"("userId", "date");

-- AddForeignKey
ALTER TABLE "PixelStats" ADD CONSTRAINT "PixelStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
