const mysql = require('mysql')
const config = require('./config.js')
// const { query } = require('./index')

const initSql = `
CREATE TABLE user(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    name VARCHAR(64)    COMMENT '用户名' ,
    phone VARCHAR(32)    COMMENT '手机' ,
    password VARCHAR(128)    COMMENT '密码' ,
    wechat_id VARCHAR(64)    COMMENT '微信id' ,
    level INT   DEFAULT 0 COMMENT '代理等级' ,
    uuid VARCHAR(32)    COMMENT '代理码' ,
    superior_id VARCHAR(64)    COMMENT '上级代理id' ,
    is_admin VARCHAR(1)   DEFAULT 0 COMMENT '是否管理 0普通用户，1管理' ,
    is_del VARCHAR(1)   DEFAULT 0 COMMENT '是否删除 0正常，1删除' ,
    status VARCHAR(1)   DEFAULT 0 COMMENT '是否可用 0可用，1不可用' ,
    created_by VARCHAR(64)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(64)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '用户表 ';

ALTER TABLE user COMMENT '用户表';
CREATE TABLE home(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    title VARCHAR(128)    COMMENT '标题' ,
    user_name VARCHAR(128)    COMMENT '发布人' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '是否可用' ,
    created_by VARCHAR(64)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(64)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '首页 ';

ALTER TABLE home COMMENT '首页';
CREATE TABLE content(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    order_id VARCHAR(64)    COMMENT '所属id' ,
    label_id VARCHAR(64)    COMMENT '标签id' ,
    label_name VARCHAR(128)    COMMENT '标签名' ,
    type VARCHAR(32)    COMMENT '类型 区分首页、素材、圈图' ,
    media VARCHAR(32)    COMMENT '媒体类型 区分文字、图片、视频、音频' ,
    content VARCHAR(3072)    COMMENT '内容' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '是否可用' ,
    created_by VARCHAR(64)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(64)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '内容 ';

ALTER TABLE content COMMENT '内容';
CREATE TABLE material(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    type VARCHAR(32)    COMMENT '素材分类 存放区分产品、视频、活动' ,
    title VARCHAR(32)    COMMENT '标题' ,
    user_name VARCHAR(128)    COMMENT '发布人' ,
    label_id VARCHAR(64)    COMMENT '所属标签' ,
    label_name VARCHAR(128)    COMMENT '标签名' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '是否可用' ,
    created_by VARCHAR(64)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(64)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '素材 ';

ALTER TABLE material COMMENT '素材';
CREATE TABLE moments(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    user_name VARCHAR(128)    COMMENT '发布人' ,
    content VARCHAR(3072)    COMMENT '圈文' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '是否可用' ,
    created_by VARCHAR(64)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(64)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '朋友圈 ';

ALTER TABLE moments COMMENT '朋友圈';
CREATE TABLE collect_like(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    momentes_id VARCHAR(64)    COMMENT '圈id' ,
    type VARCHAR(32)    COMMENT '类型 区分点赞或收藏' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '是否可用' ,
    created_by VARCHAR(64)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(64)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '收藏点赞表 ';

ALTER TABLE collect_like COMMENT '收藏点赞表';
CREATE TABLE labels(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    type VARCHAR(32)    COMMENT '类型 区分素材标签、朋友圈标签' ,
    name VARCHAR(128)    COMMENT '名称' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '是否可用' ,
    created_by VARCHAR(64)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(64)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '标签表 ';

ALTER TABLE labels COMMENT '标签表';

`

var connection = mysql.createConnection({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
  timezone: config.database.timezone,
  multipleStatements: true // 支持执行多条 sql 语句
})

connection.query(initSql, (err, result) => {
  if (err) { console.log(err) }
//   console.log(result)
})
