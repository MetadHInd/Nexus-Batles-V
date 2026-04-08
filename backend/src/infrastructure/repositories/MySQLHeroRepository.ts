import { Heroe } from "../../domain/entities/Heroe";
import { pool } from "../database/connection";

export class MySQLHeroRepository {

  async create(hero: Heroe): Promise<Heroe> {

    // 👇 ESTE ES EL CONSOLE.LOG (ANTES DE GUARDAR)
    console.log("🚀 Intentando guardar:", hero);

    const [result]: any = await pool.query(
      `INSERT INTO heroes (name, description, price, stars, type, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        hero.name,
        hero.description,
        hero.price,
        hero.stars,
        hero.type,
        hero.image
      ]
    );

    // 👇 ESTE TAMBIÉN (DESPUÉS DE GUARDAR)
    console.log("✅ Resultado BD:", result);

    hero.id = result.insertId;

    return hero;
  }
  async findAll(): Promise<Heroe[]> {

  const [rows]: any = await pool.query(
    `SELECT * FROM heroes`
  );

  return rows;
}
}