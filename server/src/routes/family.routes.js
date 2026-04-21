const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/mysql");
const { authenticateToken } = require("../middleware/auth.middleware");
const { QueryTypes } = require("sequelize");

router.get("/members", authenticateToken, async (req, res) => {
  try {
    const rows = await sequelize.query("SELECT * FROM family_members WHERE user_id = ? ORDER BY created_at ASC", { replacements: [req.user.id], type: QueryTypes.SELECT });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/members", authenticateToken, async (req, res) => {
  const { name, relationship, phone, blood_group, medical_notes, workplace } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Name and phone required" });
  try {
    const [result] = await sequelize.query("INSERT INTO family_members (user_id, name, relationship, phone, blood_group, medical_notes, workplace) VALUES (?, ?, ?, ?, ?, ?, ?)", { replacements: [req.user.id, name, relationship, phone, blood_group, medical_notes, workplace], type: QueryTypes.INSERT });
    res.json({ id: result, name, relationship, phone, blood_group, medical_notes, workplace });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/members/:id", authenticateToken, async (req, res) => {
  try {
    await sequelize.query("DELETE FROM family_members WHERE id = ? AND user_id = ?", { replacements: [req.params.id, req.user.id], type: QueryTypes.DELETE });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/meeting-points", authenticateToken, async (req, res) => {
  try {
    const rows = await sequelize.query("SELECT * FROM meeting_points WHERE user_id = ? ORDER BY created_at ASC", { replacements: [req.user.id], type: QueryTypes.SELECT });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/meeting-points", authenticateToken, async (req, res) => {
  const { name, address, landmark, notes } = req.body;
  if (!name || !address) return res.status(400).json({ error: "Name and address required" });
  try {
    const [result] = await sequelize.query("INSERT INTO meeting_points (user_id, name, address, landmark, notes) VALUES (?, ?, ?, ?, ?)", { replacements: [req.user.id, name, address, landmark, notes], type: QueryTypes.INSERT });
    res.json({ id: result, name, address, landmark, notes });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/meeting-points/:id", authenticateToken, async (req, res) => {
  try {
    await sequelize.query("DELETE FROM meeting_points WHERE id = ? AND user_id = ?", { replacements: [req.params.id, req.user.id], type: QueryTypes.DELETE });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/contacts", authenticateToken, async (req, res) => {
  try {
    const rows = await sequelize.query("SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY priority ASC", { replacements: [req.user.id], type: QueryTypes.SELECT });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/contacts", authenticateToken, async (req, res) => {
  const { name, role, phone, priority } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Name and phone required" });
  try {
    const [result] = await sequelize.query("INSERT INTO emergency_contacts (user_id, name, role, phone, priority) VALUES (?, ?, ?, ?, ?)", { replacements: [req.user.id, name, role, phone, priority || 1], type: QueryTypes.INSERT });
    res.json({ id: result, name, role, phone, priority });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/contacts/:id", authenticateToken, async (req, res) => {
  try {
    await sequelize.query("DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?", { replacements: [req.params.id, req.user.id], type: QueryTypes.DELETE });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
