"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/start', (req, res) => {
    const { domain } = req.body;
    // Implementation using questions.json
    res.json({ questions: [] }); // Placeholder
});
router.post('/submit', (req, res) => {
    // Score calculation
    res.json({ level: 'Intermediate' });
});
exports.default = router;
