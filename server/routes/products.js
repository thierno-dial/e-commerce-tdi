const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all products' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create product' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update product ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete product ${req.params.id}` });
});

module.exports = router;
