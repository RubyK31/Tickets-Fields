-- CreateTable
CREATE TABLE "_TicketFields" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TicketFields_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TicketFields_B_index" ON "_TicketFields"("B");

-- AddForeignKey
ALTER TABLE "_TicketFields" ADD CONSTRAINT "_TicketFields_A_fkey" FOREIGN KEY ("A") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketFields" ADD CONSTRAINT "_TicketFields_B_fkey" FOREIGN KEY ("B") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
