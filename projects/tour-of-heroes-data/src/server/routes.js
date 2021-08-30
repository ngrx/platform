const express = require('express');
const router = express.Router();

router.get('/heroes', (req, res) => {
  res.send([
    {
      id: 221,
      name: 'Big Hero 6',
      saying: 'fa la la la la (from node server)',
    },
  ]);
});

router.get('/badguys', (req, res) => {
  res.send([
    {
      id: 41,
      name: 'Bad Guy',
      saying: 'bwahahahaha (from node server)',
    },
  ]);
});

module.exports = router;
