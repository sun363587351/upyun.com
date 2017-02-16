// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')
env.NODE_ENV = 'prerendering'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prer.conf')

var PrerenderSpaPlugin = require('prerender-spa-plugin')
webpackConfig.plugins.push(
  new PrerenderSpaPlugin(
    path.join(__dirname, '../prerender'),
    ['/', '/product/uss', '/product/cdn', '/product/ups', '/product/mobile', '/product/vod', '/product/live', '/solution/av']
  )
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.prerender.assetsRoot, config.prerender.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})