const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const helmet = require('koa-helmet')
const respond = require('koa-respond')
const serve = require('koa-static')
const path = require('path')
const logger = require('koa-logger')
const Koa_Session = require('koa-session')
const requireDirectory = require('require-directory')
const moment = require('moment')

const logsUtil = require('./helper/logs.js')

const app = new Koa()
const router = new Router()
const port = process.env.PORT || 3000

// require('./router/index')(router)

// 定义允许直接访问的url
const allowpage = ['/static/css', '/static/js', '/static/fonts', '/static/img/', '/', '/css/index.css',
  '/js/index.js', '/api/user/login']

// 通过官网的接口
const indexAllow = ['/api/test/test1']

const session_signed_key = ['medium'] // 这个是配合signed属性的签名key
const session_config = {
  key: 'USER_SID', /**  cookie的key。 (默认是 koa:sess) */
  maxAge: 60 * 60 * 1000 * 2, /**  session 过期时间，以毫秒ms为单位计算 。*/
  autoCommit: true, /** 自动提交到响应头。(默认是 true) */
  overwrite: true, /** 是否允许重写 。(默认是 true) */
  httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
  signed: true, /** 是否签名。(默认是 true) */
  rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
  renew: false /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
}
const session = Koa_Session(session_config, app)
app.keys = session_signed_key

// 拦截
function localFilter(ctx, next) {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
  const url = ctx.originalUrl
  console.log(ctx.url)
  if (allowpage.indexOf(url) > -1) {
    // console.log('当前地址可直接访问')
    return next()
  } else if (url.search(allowpage[0]) > -1 || url.search(allowpage[1]) > -1 || url.search(allowpage[2]) > -1 || url.search(allowpage[3]) > -1) {
    return next()
  } else if (ctx.session && ctx.session.isLogin && ctx.session.userName) {
    // console.log('正常访问')
    return next()
  } else {
    for (const i of indexAllow) {
      if (url.search(i) > -1) {
        return next()
      }
    }
  }
  ctx.body = {
    code: 403,
    status: 403,
    statusText: '未登陆'
  }
}

app
  .use(logger())
  .use(koaBody({
    multipart: true, // 支持文件上传
    // encoding: 'gzip',
    formidable: {
    //   uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 5 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => { // 文件上传前的设置
        // console.log(`name: ${name}`)
        // console.log(file)
      }
    }
  }))
  .use(helmet())
  .use(respond())
  .use(session)
  .use(async(ctx, next) => {
    await localFilter(ctx, next)
    // await next()
  })
  .use(async(ctx, next) => {
    const start = new Date() // 响应开始时间
    let intervals // 响应间隔时间
    try {
      await next()
      intervals = new Date() - start
      logsUtil.logResponse(ctx, intervals) // 记录响应日志
    } catch (error) {
      console.log('======================出错了============================')
      console.log(error)
      intervals = new Date() - start
      logsUtil.logError(ctx, error, intervals)// 记录异常日志
    }
  })
//   .use(router.routes())

requireDirectory(module, './router', {
  visit: route => app.use(route.routes())
})
console.log(process.cwd())
app
  .use(router.allowedMethods())
  .use(serve(path.join(process.cwd(), '/upload')))
  .use(serve(path.join(process.cwd(), 'dist')))
  .listen(port, () => {
    console.log('The server is running at:')
    console.log(
      `    - Local:  http://localhost:${port}`
    )
  })
