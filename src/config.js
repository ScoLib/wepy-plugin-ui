// config
export const UI_SOURCE_DIR = 'dist'
export const TARGET_DIR_NAME = 'ui-components'
export const VERSION_FILE_NAME = '.version'

// export const UI_COMPONENTS = ['vant']
export const UI_COMPONENTS = {
    vant: {
        inject_ignore: {
            "common": true,
            "mixins": true,
            "wxs": true
        }
    },
    wux: {
        inject_ignore: {
            'countdown': true,
            'countup': true,
            'styles': true,
            'helpers': true,
            'index.js': true
        }
    }
}

export const DEFAULT_CONFIG = {
    pagePath: 'pages',
    config: {
        vant: {
            inject: true,
            prefix: 'van-'
        },
        wux: {
            inject: true,
            prefix: 'wux-'
        },
        px2: {
            relative: 400,
            decimalPlaces: 2,
            comment: 'no',
            targetUnits: 'rpx'
        }
    }
}

