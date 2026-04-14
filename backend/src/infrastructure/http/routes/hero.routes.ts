import { Router } from "express";
import multer from "multer";
import { HeroController } from "../controllers/HeroController";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roleMiddleware";

export function createHeroRoutes(controller: HeroController) {

  const router = Router();
  const upload = multer({ dest: "uploads/" });

  // ========== LECTURA (PÚBLICOS) ==========
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

  // ========== CREAR HEROE (SOLO ADMIN) ==========
  // 🔧 CRÍTICO: Agregado authenticateJWT + requireRole(['ADMIN'])
  router.post(
    "/heroes",
    authenticateJWT,
    requireRole(['ADMIN']),
    upload.single("imagen"),
    (req, res) => controller.crear(req, res)
  );

  // ========== ACTUALIZAR HEROE (SOLO ADMIN) ==========
  // 🔧 CRÍTICO: Agregado authenticateJWT + requireRole(['ADMIN'])
  router.put(
    "/heroes/:id",
    authenticateJWT,
    requireRole(['ADMIN']),
    upload.single("imagen"),
    (req, res) => controller.actualizar(req, res)
  );

  // ========== ELIMINAR HEROE (SOLO ADMIN) ==========
  // 🔧 CRÍTICO: Agregado authenticateJWT + requireRole(['ADMIN'])
  router.delete(
    "/heroes/:id",
    authenticateJWT,
    requireRole(['ADMIN']),
    (req, res) => controller.eliminar(req, res)
  );

  return router;
}