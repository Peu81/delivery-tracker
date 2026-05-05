-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entrega" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CRIADA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "id_motorista" INTEGER,
    CONSTRAINT "Entrega_id_motorista_fkey" FOREIGN KEY ("id_motorista") REFERENCES "Motorista" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entrega" ("createdAt", "descricao", "destino", "id", "id_motorista", "origem", "status", "updatedAt") SELECT "createdAt", "descricao", "destino", "id", "id_motorista", "origem", "status", "updatedAt" FROM "Entrega";
DROP TABLE "Entrega";
ALTER TABLE "new_Entrega" RENAME TO "Entrega";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
