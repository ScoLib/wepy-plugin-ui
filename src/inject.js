import {
    readdirSync
} from 'fs';
import {
    join,
    resolve,
    relative,
    dirname
} from 'path';
import {
    TARGET_DIR_NAME,
    VERSION_FILE_NAME,
    UI_COMPONENTS,
} from './config'

import { getPageConfigFilter } from './units';
import { normalize } from 'upath';
import { copyUiComponents } from './copy';

// 获取需要注入的组件
const getInjectComponents = (ui, globalConfig, pageConfig) => {
    
    let globalInject = [];

    let pageComponents = [];
    if (pageConfig.hasOwnProperty(ui)) {
        pageComponents = pageConfig[ui];

        if (globalConfig[ui].inject === false && pageComponents.length) { // 只在page页注入
            copyUiComponents(ui, pageComponents);
        }
        delete pageConfig[ui];
    }
    
    if (globalConfig[ui].inject === true) {
        let targetPath = join('src', TARGET_DIR_NAME, ui)

        let components = readdirSync(targetPath).filter(component => (!UI_COMPONENTS[ui].inject_ignore[component] && component != VERSION_FILE_NAME))
        globalInject = components;
    }

    if (globalConfig[ui].inject instanceof Array) {
        globalInject = globalConfig[ui].inject;
    }

    return [...new Set(globalInject.concat(pageComponents))].filter(component => component);
}


const injectUiComponents = (ui, op, globalConfig, pageConfig) => {
    
    let injectComponents = getInjectComponents(ui, globalConfig, pageConfig); // 获取要注入的组件
    let relativePath = relative(dirname(op.file), resolve('dist/')); // 获取相对的路径

    pageConfig.usingComponents = pageConfig.usingComponents || {};
    injectComponents.forEach(component => (pageConfig.usingComponents[globalConfig[ui].prefix + component] = normalize(relativePath) + '/' + TARGET_DIR_NAME + '/' + ui + '/' + component + '/index'))
    console.log('injectUiComponents', pageConfig.usingComponents)
}

const injectComponents = (op, setting) => {
    let filter = getPageConfigFilter(setting.pagePath);
    if (filter.test(op.file) && op.type === 'config') {
        let globalConfig = setting.config;
        let pageConfig = JSON.parse(op.code);
        // console.log('injectComponents', op);

        // 将组件注入到json的usingComponents中
        Object.keys(UI_COMPONENTS).forEach(ui => {
            console.log('injectComponents', UI_COMPONENTS[ui].inject_ignore);
            console.log('injectComponents', ui);
            // check ui is installed or not
            try {
                eval(`require('${ui}-weapp/package.json')`);
                // console.log(ui);
                injectUiComponents(ui, op, globalConfig, pageConfig)

            } catch (e) {
                console.log('injectComponents e', e)
                throw new Error(`\n 未检测到: ${ui}-weapp \n 您是否安装 ${ui}-weapp ? \n 尝试 npm i -S ${ui}-weapp`);
            }

        })

        console.log('injectComponents', pageConfig.usingComponents)

        op.code = JSON.stringify(pageConfig)  //更新文件内容
        op.output && op.output({
            action: '变更',
            file: op.file
        })
    }
    return op;
}

export default injectComponents;