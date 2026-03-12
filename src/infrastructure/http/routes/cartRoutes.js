"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CartController_1 = require("../../controllers/CartController");
var router = (0, express_1.Router)();
router.post("/add", CartController_1.CartController.add);
exports.default = router;
