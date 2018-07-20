const path = require('path');
const Koa = require('koa');
const views = require('koa-views');
const koaStatic = require('koa-static');

const app = new Koa();

if (process.env.NODE_ENV === 'development') {
  // the path of static folder
  const staticPath = './static';
  app.use(koaStatic(path.join(__dirname, staticPath)));
}

// setup views, appending .ejs
// when no extname is given to render()
app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' }));

app.use(async (ctx) => {
  await ctx.render('index');
});

app.listen(3000);
