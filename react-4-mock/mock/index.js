var koa = require('koa');
var app = new koa();
var koaRouter = require('koa-router');
var router = new koaRouter();
const port = 9001;
// home
var homeData = require('./home/index.js');
// list
var listData = require('./list/index.js');
// detail

router.get('/api/list', function (ctx) {
  ctx.body = listData
});

router.get('/api/home', function (ctx) {
  ctx.body = homeData
});

app.use(router.routes())
app.use(router.allowedMethods());
try {
  app.listen(port)
  console.log('listening in http://localhost:' + port)
} catch (error) {
  console.log('error')
}




