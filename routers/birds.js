const express = require('express')
const router = express.Router()

// 打印路由调用时间的中间函数
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', (req, res) => {
  res.send('Birds home page ')
})

router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router