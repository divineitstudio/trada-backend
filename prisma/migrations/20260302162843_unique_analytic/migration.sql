/*
  Warnings:

  - A unique constraint covering the columns `[symbol_id]` on the table `MarketAnalytics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MarketAnalytics_symbol_id_key" ON "MarketAnalytics"("symbol_id");
