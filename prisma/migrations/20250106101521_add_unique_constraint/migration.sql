/*
  Warnings:

  - A unique constraint covering the columns `[fieldName]` on the table `fields` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fieldName,type]` on the table `fields` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "fields_fieldName_key" ON "fields"("fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "fields_fieldName_type_key" ON "fields"("fieldName", "type");
