-- CreateTable
CREATE TABLE "Signal" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "sender_id" INTEGER,
    "type" TEXT NOT NULL,
    "entry_price" DECIMAL(20,8) NOT NULL,
    "sl_price" DECIMAL(20,8) NOT NULL,
    "tp_price" DECIMAL(20,8) NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
