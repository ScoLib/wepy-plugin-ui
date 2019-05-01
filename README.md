# wepy-plugin-ui
一个加载小程序UI组件的wepy的小插件，支持：`vant-weapp`、`wux-weapp`

## 特性
* 自动注入
* 简易配置
* px转换(rpx, rem, em, px)

## 用法
1. 安装UI组件，如：`vant-weapp`
```bash
  $ npm i vant-weapp -S
```
2. 安装`wepy-plugin-ui`
```bash
  $ npm i wepy-plugin-ui
```
3. 在`wepy.config.js`中`plugins`项中添加 `ui:{}`
```javascript
  plugins: {
    // ...
    ui: {
    }
    // ...
  }
```
4. 运行项目，即可使用vant的全部组件啦~~   如:`<van-button></van-button>`

## 全局注入配置

默认是在`pages`目录下的所有页面的`usingComponents`中，自动注入全部UI组件。
```javascript
  ui: {
      pagePath: 'pages',
      // 可选，默认为 pages。如果页面目录不为pages，或有多个目录, 通过此值设置。
      // 参考配置：
      // pagePath: 'page2'                         page2为页面有目录
      // pagePath:['page1','page2',...]            多页面目录
         
      config: {
        vant: {
            inject: true,
            // 可选，默认为 true, 注入Vant的全部组件。 如果不想全部, 通过此值设置。
            // 参考配置：
            // inject: false                           不注入任何组件
            // inject:['button','icon',...]            只注入部分组件

            prefix: 'van-',
            // 可选，默认为 'wux-', 组件名前缀。 如果使用其他组件名前缀, 通过此值设置。
            // 参考配置：
            // prefix: 'a-'                            button的组件名为'a-button'
          },
          wux: {
            inject: true,
            // 可选，默认为 true, 注入Wux的全部组件。 如果不想全部, 通过此值设置。
            // 参考配置：
            // inject: false                           不注入任何组件
            // inject:['button','icon',...]            只注入部分组件

            prefix: 'wux-',
            // 可选，默认为 'wux-', 组件名前缀。 如果使用其他组件名前缀, 通过此值设置。
            // 参考配置：
            // prefix: 'a-'                            button的组件名为'a-button'
        },

        px2: false  
        // 可选，默认为false, 开启px单位转换。 可选值 true, false, config object {...}
       // 参考配置：
       // px2: true
       // px2: {}

      //  px2: {
      //       relative: 400,          // 相对值,rpx是 相对于750宽度 ；  rem，em 是相对的 font-size
      //       decimalPlaces: 2,       //  保留的小数位数
      //       targetUnits: 'rpx'      // 目标转换的单位 支持 rpx rem em px
      //   }
      }
    }
```

## 页面注入配置

很多情况下，不希望注入太多的组件。可以通过全局配置的`inject:false`或`inject:['button','icon',...]`来实现。
或者直接在页面通过下面的方式设置。

在页面的config中添加,即可快速注入。

```javascript
  config = {
    vant: ['button', 'toast'],
    wux: ['button', 'toast']
  }

```



> 注意： 在非全局注入组件的情况下，插件不会将配置的组件中引用的组件一并引用，所以需手动配置，如：

```javascript
  config = {
    vant: ['button', 'loading']
  }

```

 在使用`button`时，其引用的`loading`组件不会自动同步到src目录下，所以需要配置`loading`组件