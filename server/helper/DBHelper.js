const { query, format } = require('../config')

exports.getList = (table, limit, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${value ? str : ''} ORDER BY created_time DESC limit ${limit[0]}, ${limit[1]}`
  return query(sql, value)
}

exports.getListTotal = (table, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT COUNT(*) AS count FROM ${table} WHERE STATUS='1' ${value ? str : ''} ORDER BY created_time DESC`
  return query(sql, value)
}

exports.delRow = (table, id) => {
  const sql = `UPDATE ${table} SET status = '0' where id = '${id}'`
  return query(sql)
}

exports.updateRow = (table, id, value) => {
  const sql = `UPDATE ${table} SET ? WHERE id='${id}'`
  return query(sql, value)
}

exports.addRow = (table, value) => {
  const sql = `insert into ${table} set ?`
  return query(sql, value)
}

exports.addRowFormat = (table, value) => {
  const sql = `insert into ${table} set ?`
  return format(sql, value)
}

exports.getListFormat = (table, limit, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${value ? str : ''} limit ${limit[0]}, ${limit[1]}`
  return format(sql, value)
}

exports.getListInRow = (table, limit, value, inArr) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  for (const arr in inArr) {
    const strArr = []
    for (const item of inArr[arr]) {
      // str += ` AND ${arr} IN ('${value[item]}')`
      strArr.push(`'${item}'`)
    }
    str += ` AND ${arr} IN (${strArr.join(',')})`
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${value || inArr ? str : ''} limit ${limit[0]}, ${limit[1]}`
  return format(sql, value)
}

exports.updateByParams = (table, values, conditions) => {
  let str = ''
  for (const item in conditions) {
    str += ` AND ${item} = '${conditions[item]}'`
  }
  const sql = `UPDATE ${table} SET ? WHERE STATUS='1' ${str}`
  return query(sql, values, conditions)
}

/* 支持in查询，like查询
values：{a:1,b:2}
inValuesObj:{a:[]}
likeValues:{a:1,b:2}
daterange:{timeName:[start,end]}
*/
exports.getListsInLike = (table, limit, values, inValuesObj, likeValues, daterange) => {
  let str = ''
  for (const item in values) {
    str += ` AND ${item} = '${values[item]}'`
  }
  for (const item in likeValues) {
    if (likeValues[item]) {
      str += ` AND ${item} like '%${likeValues[item]}%'`
    }
  }
  for (const arr in inValuesObj) {
    const strArr = []
    for (const item of inValuesObj[arr]) {
      // str += ` AND ${arr} IN ('${value[item]}')`
      strArr.push(`'${item}'`)
    }
    if (strArr.length > 0) {
      str += ` AND ${arr} IN (${strArr.join(',')})`
    }
  }
  for (const item in daterange) {
    if (daterange[item] && daterange[item][0] && daterange[item][1]) {
      str += `AND ${item} BETWEEN '${daterange[item][0]} 00:00:00' AND '${daterange[item][1]} 23:59:59'`
    }
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${values || inValuesObj || likeValues ? str : ''} ORDER BY created_time DESC limit ${limit[0]}, ${limit[1]}`
  return query(sql)
}

exports.getListsInLikeTotal = (table, values, inValuesObj, likeValues, daterange) => {
  let str = ''
  for (const item in values) {
    str += ` AND ${item} = '${values[item]}'`
  }
  for (const item in likeValues) {
    if (likeValues[item]) {
      str += ` AND ${item} like '%${likeValues[item]}%'`
    }
  }
  for (const arr in inValuesObj) {
    const strArr = []
    for (const item of inValuesObj[arr]) {
      // str += ` AND ${arr} IN ('${value[item]}')`
      strArr.push(`'${item}'`)
    }
    if (strArr.length > 0) {
      str += ` AND ${arr} IN (${strArr.join(',')})`
    }
  }
  for (const item in daterange) {
    if (daterange[item] && daterange[item][0] && daterange[item][1]) {
      str += `AND ${item} BETWEEN '${daterange[item][0]} 00:00:00' AND '${daterange[item][1]} 23:59:59'`
    }
  }
  const sql = `SELECT COUNT(*) AS count FROM ${table} WHERE STATUS='1' ${values || inValuesObj || likeValues ? str : ''}`
  format(sql)
  return query(sql)
}
