import { Router } from "express";
import multer from "multer";
import { HeroController } from "../controllers/HeroController";

export function createHeroRoutes(controller: HeroController) {

  const router = Router();
  const upload = multer({ dest: "uploads/" });

  // 🔥 CREAR HEROE
  router.post(
    "/heroes",
    upload.single("imagen"),
    (req, res) => controller.crear(req, res)
  );

  // 🔥 LISTAR HEROES
  router.get(
    "/heroes",
    (req, res) => controller.listar(req, res)
  );

  // 🔥 OBTENER UN HEROE POR ID
  router.get(
    "/heroes/:id",
    (req, res) => controller.obtenerPorId(req, res)
  );

  // 🔥 ACTUALIZAR HEROE
  router.put(
    "/heroes/:id",
    upload.single("imagen"),
    (req, res) => controller.actualizar(req, res)
  );

  // 🔥 ELIMINAR HEROE
  router.delete(
    "/heroes/:id",
    (req, res) => controller.eliminar(req, res)
  );

  return router;
}