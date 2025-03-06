/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber,restaurant_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_restaurant_id_key" ON "Order"("orderNumber", "restaurant_id");
