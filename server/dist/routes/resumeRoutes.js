"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumeController_1 = require("../controllers/resumeController");
const router = (0, express_1.Router)();
router.post('/upload', resumeController_1.uploadResume);
exports.default = router;
