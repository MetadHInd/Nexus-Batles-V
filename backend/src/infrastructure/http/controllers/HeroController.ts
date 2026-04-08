import { Request, Response } from "express";
import { CrearHeroe } from "../../../application/usecases/Heroes/CrearHeroe";
import { ObtenerHeroes } from "../../../application/usecases/Heroes/ObtenerHeroes";

export class HeroController {

  constructor(
    private crearHeroe: CrearHeroe,
    private obtenerHeroes: ObtenerHeroes
  ) {}

  // 🔥 CREAR HEROE
  async crear(req: Request, res: Response) {
    try {
      const { name, description, price, stars, type } = req.body;

      console.log("📦 BODY:", req.body);

      const hero = await this.crearHeroe.ejecutar({
        name,
        description,
        price: Number(price),
        stars: Number(stars),
        type,
        image: req.file?.path || ""
      });

      res.json(hero);

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  //los diferentes métodos del controlador reciben la petición y la respuesta, y llaman a los casos de uso correspondientes para procesar la lógica de negocio, luego envían la respuesta al cliente. 
  // 🔥 OBTENER POR ID
async obtenerPorId(req: Request, res: Response) {
  res.json({ message: "Pendiente implementar" });
}

// 🔥 ACTUALIZAR
async actualizar(req: Request, res: Response) {
  res.json({ message: "Pendiente implementar" });
}

// 🔥 ELIMINAR
async eliminar(req: Request, res: Response) {
  res.json({ message: "Pendiente implementar" });
}

  // 🔥 LISTAR HEROES
  async listar(req: Request, res: Response) {
    try {
      const heroes = await this.obtenerHeroes.ejecutar();
      res.json(heroes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
}