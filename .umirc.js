// ref: https://umijs.org/config/
import { resolve } from 'path'
import routes from './config/routes.config.js'

export default {
  history: 'hash',
  hash: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      dva: { immer: true },
      antd: true,
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader/Loader',
      },
      title: '乐莎莎管理系统',
      routes: {
        exclude: [
          /model\.(j|t)sx?$/,
          /service\.(j|t)sx?$/,
          /models\//,
          /components\//,
          /services\//,
          /common\//,
        ]
      },
      dll: false,
      hardSource: false,
      links: [
        { rel: 'shortcut icon', href: 'https://images.lesasa.com/bitbug_favicon.ico' },
      ],
    }],
  ],
  alias: {
    api: resolve(__dirname, './src/services/'),
    components: resolve(__dirname, './src/components'),
    models: resolve(__dirname, './src/models'),
    services: resolve(__dirname, './src/services'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
    config: resolve(__dirname, './config'),
    hoc: resolve(__dirname, './src/hoc/'),
  },
  devServer: {
    host: 'http://192.168.3.150'
  },
  theme: './config/theme.config.js',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
  routes
}
