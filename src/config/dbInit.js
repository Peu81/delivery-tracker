import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database});

  await db.exec(`
    CREATE TABLE IF NOT EXISTS motoristas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        placaVeiculo TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ATIVO'
    );
    CREATE TABLE IF NOT EXISTS entregas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        origem TEXT NOT NULL,
        destino TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'CRIADA',
        fk_id_motorista INTEGER
    );
    CREATE TABLE IF NOT EXISTS eventos_entrega (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        informacoes TEXT NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        fk_id_entrega INTEGER REFERENCES entregas(id) ON DELETE CASCADE)
  `);

  return db;
}