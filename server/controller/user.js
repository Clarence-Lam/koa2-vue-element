class UserController {
  async login(ctx) {
    const { test } = ctx.query
    ctx.session.isLogin = true
    ctx.session.userName = 'Super Admin'
    ctx.body = {
      status: 200,
      statusText: 'ok',
      code: 20000,
      data: { token: 'admin-token' }
    }
  }
  async info(ctx) {
    const { test } = ctx.request.body
    ctx.body = {
      status: 200,
      statusText: 'ok',
      code: 20000,
      data: {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }

    }
  }
  async test3(ctx) {
    const { id } = ctx.params.id
    ctx.body = {
      status: 200,
      statusText: 'ok'
    }
  }

  async logout(ctx) {
    ctx.session.isLogin = false
    ctx.session.userName = ''
    ctx.body = {
      status: 200,
      statusText: 'ok',
      code: 20000,
      data: 'success'
    }
  }
}
module.exports = new UserController()
