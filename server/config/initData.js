const mysql = require('mysql')
const config = require('./config.js')
const uuidv1 = require('uuid/v1')
const moment = require('moment')
const bcrypt = require('bcrypt')

const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
  timezone: config.database.timezone
})

const query = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

const createAdmin = function() {
  const adminSQL = 'insert into user set ?'
  const phone = '13510520707'
  const pwd = '123456'
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(pwd, salt)
  const params = {
    id: uuidv1(),
    name: '管理员',
    phone,
    password: hash,
    role: 'admin',
    dept: '管理',
    position: '管理员',
    created_by: 'system',
    created_time: moment().format('YYYY-MM-DD HH:mm:ss')
  }
  query(adminSQL, params).then(() => {
    console.log('成功创建管理员')
  })
}

const createTypes = function() {
  const insertSQL = 'insert into types set ?'
  const insertToFilds = 'insert into types_field set ?'
  const created_by = 'system'
  const created_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const dept = {
    0: 'platform',
    1: 'medium',
    2: 'question'
  }
  const types = ['推荐平台', '是否可以联系方式', '价格区间', '包补时间', '百度电脑权重', '排序']
  const names = [{
    '推荐平台': ['论坛推广', 'B2B分类信息网推广', '博客推广'],
    '是否可以联系方式': ['可以', '不可以'],
    '价格区间': ['0-50', '51-100', '101-200', '201-500', '500以上'],
    '包补时间': ['3天', '5天', '7天', '7天以上', '不包补'],
    '百度电脑权重': ['1-3', '4-6', '7-10'],
    '排序': ['价格', '权重', '收藏']
  }, {
    '推荐平台': ['自媒体推广', '媒体推广'],
    '是否可以联系方式': ['可以', '不可以'],
    '价格区间': ['0-50', '51-100', '101-200', '201-500', '500以上'],
    '包补时间': ['3天', '5天', '7天', '7天以上', '不包补'],
    '百度电脑权重': ['1-3', '4-6', '7-10'],
    '排序': ['价格', '权重', '收藏']
  }, {
    '推荐平台': ['百度知道', '悟空问答', '知乎问答', '房天下问答', '太平洋问答', '新浪爱问', '360问答', '搜狗问问'],
    '是否可以联系方式': ['可以', '不可以'],
    '价格区间': ['0-50', '51-100', '101-200', '201-500', '500以上'],
    '包补时间': ['3天', '5天', '7天', '7天以上', '不包补'],
    '百度电脑权重': ['1-3', '4-6', '7-10'],
    '排序': ['价格', '权重', '收藏']
  }]
  for (let i = 0; i < 3; i++) {
    types.map(item => {
      const id = uuidv1()
      const deptName = dept[i]
      const params = {
        id: id,
        dept: deptName,
        name: item,
        created_by,
        created_time
      }
      query(insertSQL, params).then((result) => {
        console.log('成功创建\'' + dept[i] + '\'的\'' + item + '\'主题');
        (names[i][item]).map(name => {
          query(insertToFilds, {
            id: uuidv1(),
            type: id,
            type_name: item,
            name,
            dept: deptName,
            created_by,
            created_time
          }).then(() => {
            console.log('成功创建\'' + dept[i] + '\'的\'' + name + '\'内容')
          })
        })
      })
    })
  }
}

const create_default_time = function() {
  const insertSQL = 'insert into expected_time set ?'
  const created_by = 'system'
  const created_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const dept = {
    0: 'platform',
    1: 'medium',
    2: 'question'
  }
  const time = ['1天', '3天', '7天']
  for (const item in dept) {
    for (const i of time) {
      let is_default = '0'
      if (i === '3天') {
        is_default = '1'
      }
      query(insertSQL, {
        id: uuidv1(),
        name: i,
        dept: dept[item],
        is_default,
        created_by,
        created_time
      }).then(() => {
        console.log('成功创建预期时间')
      }).catch(() => {
        console.log('创建预期时间error')
      })
    }
  }
}

// 10.20针对旧数据的排序增加收藏
const addCollection = () => {
  console.log('开始增加收藏')
  const sql = 'select * from types where name = \'排序\' '
  const insertToFilds = 'insert into types_field set ?'
  query(sql).then(result => {
    for (const item of result) {
      query(insertToFilds, {
        id: uuidv1(),
        type: item.id,
        type_name: item.name,
        name: '收藏',
        dept: item.dept,
        created_by: 'system',
        created_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).then(() => {
        console.log('成功创建\'' + item.dept + '\'的收藏')
      })
    }
  })
}

// createAdmin()// 初始化管理员
// createTypes()// 初始化类型
// create_default_time()// 初始化预期时间
addCollection()
