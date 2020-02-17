const Router = require('koa-router')
const router = new Router()
const userController = require('../controller/user')

router.prefix('/api/user')

router
  .post('/login', userController.login)
  .get('/info', userController.info)
  .del('/test1/del/:id', userController.test3)
  .post('/logout', userController.logout)

module.exports = router
