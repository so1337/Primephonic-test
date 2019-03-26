const express = require('express');

const router = express.Router();
const dataStore = require('../dataStore');

/* GET usage listing. */
router.get('/', (req, res, next) => {
  const { from } = req.query;
  const data = dataStore.get();
  if (!from) {
    res.status(200).json({
      message: 'ok',
      data,
    });
  } else if (isNaN(from) || from > Date.now()) {
    res.status(400).json({
      message: 'wrong timestamp',
    });
  } else {
    res.status(200).json({
      message: 'ok',
      data: data.filter(item => item.stream_started_on >= from),
    });
  }
});


module.exports = router;
