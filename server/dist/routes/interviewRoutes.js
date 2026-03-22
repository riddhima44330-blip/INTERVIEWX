"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/start', (req, res) => {
    const { domain, level } = req.body;
    res.json({ questions: [] }); // From questions.json
});
exports.default = router;
