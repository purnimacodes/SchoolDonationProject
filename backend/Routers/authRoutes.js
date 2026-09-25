const { signup } = require('../Controllers/authController')




const router = require('express').Router();

router.post('/login', (req, res) => {
  res.send('login success');
})
router.post('/signup', signup);

module.exports = router;