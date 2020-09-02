// 引用express
const express = require('express')
const port = 8000
const router = express.Router()
const _ = require('lodash')
// 引用sql以及其服务器配置
const mysql = require('mysql')
// 可直接引用json文件
const sqlConfig = require('./config/PWConfig.json')
// 日志组件
const morgan = require('morgan')
// 文件模块
const fs = require('fs')
const path = require('path')

// 绝对路径尝试 - 可行
// const sqlConfig = require('/Works/expressjs-test/config')

// Module对象, 即当前项目内app.js相关信息
// console.log(require.main)

// 查看当前Module对象, 在此运行等同于上条
// console.log(module)

// 连接数据库
const connection = mysql.createConnection(sqlConfig)

// 创建应用主体
const app = express()

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), {flags : 'a'});

// 将日志模块注入 app
app.use(morgan('dev'))
// log only 4xx and 5xx responses to console
// 控制台仅打印 status 400 以上
app.use(morgan('dev', {
  skip: (req, res) => {
    return res.statusCode < 400
  }
}))

// 将日志模块注入 app, 并将流写入文件 'access.log'
app.use(morgan('combined', { stream: accessLogStream }))

// 创建基础返回内容
let result = {
  code: '0',
  message: '',
  data: {}
}

// 使用静态文件
// app.use(express.static('static'))

// 创建接口
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// sql语句
const sql = 'SELECT * FROM test'

// 从数据库获取数据
app.get('/sql', (req, res) => {
  connection.query(sql, (error, results, fields) => {
    if (error) throw error
    // 数据库取值相关信息
    // console.log(fields)
    result.code = '1000'
    result.message = 'success'
    result.data = _.map(results, (item, index) => {
      // console.log('-------------------')
      // console.log('item:')
      // console.log(item)
      // console.log('index:')
      // console.log(index)
      return item
    })
    // console.log(result)
    // 仅返回json格式
    // res.json(result)
    res.send(result)
  })
})

// 接口回调
app.get('/next', (req, res, next) => {
  console.log('Do next...')
  next()
}, (req, res, next) => {
  console.log('Do next success!')
  res.send('success!')
})


const birds = require('./routers/birds')
// 引用路由
app.use('/birds', birds)

app.use((req, res, next) => {
  res.status(404).send('404! Not found!');
})

// 监听端口号
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})