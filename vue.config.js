const path = require('path')
const webpack = require('webpack')

module.exports = {
  baseUrl: './',
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  indexPath: 'index.html',
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('$public', path.join(__dirname, 'public'))
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      //入口起点的最大体积
      maxEntrypointSize: 50000000,
      //生成文件的最大体积
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/theme/bass.scss";`
      }
    }
  },
  productionSourceMap: false,
  devServer: {
    // 设置主机地址
    host: '0.0.0.0',
    // 设置默认端口
    port: 3001,

    proxy: {
      '/webapi': {
        target: 'www.baidu.com/webapi',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/webapi': ''
        }
      },
      '/api/shelter': {
        target: 'http://192.168.1.83:18088',
        //pathRewrite: { '^/demo': '' },
        ws: false,
        changeOrigin: true,
        progress:false
      },
      '/geoserver': {
        target: 'http://192.168.1.80:20081',
        ws: false,
        changeOrigin: true
      },
      '/fjseism': {
        target: 'http://192.168.1.80:5080',
        ws: false,
        changeOrigin: true
      },
      '/api': {
        target: 'http://122.51.146.178:31349',
        ws: false,
        changeOrigin: true
      },
      '/v4': {
        target: 'https://api.seniverse.com',
        ws: false,
        changeOrigin: true
      }

    }
  }
}
