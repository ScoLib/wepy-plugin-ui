import {
    existsSync,
    readFileSync,
    writeFileSync,
    statSync
} from 'fs';
import { join } from 'path';
import copydir from 'copy-dir';
import mkdir from 'mkdir-p';

import {
    UI_SOURCE_DIR,
    TARGET_DIR_NAME,
    VERSION_FILE_NAME,
    UI_COMPONENTS
} from './config'

const copyUiComponents = (ui, components) => {
    const UI_PATH = eval(`require.resolve('${ui}-weapp/package.json').replace(/package.json$/, '')`);
    const sourcePath = join(UI_PATH, UI_SOURCE_DIR)
    const targetPath = join('src', TARGET_DIR_NAME, ui)

    if (!existsSync(targetPath)) {
        mkdir.sync(targetPath);
    }

    if (components.length == 0) {
        copydir.sync(sourcePath, targetPath) // 复制文件夹
    } else {
        // components = [...new Set(components.concat(Object.keys(UI_COMPONENTS[ui].inject_ignore)))].filter(component => component);
        components = components.concat(Object.keys(UI_COMPONENTS[ui].inject_ignore))
        console.log('copyUiComponents', components)
        components.forEach(component => {
            let stat = statSync(sourcePath+ '/'+component)
            if (stat.isFile()) {
                if (!existsSync(targetPath+'/'+ component)) {
                    writeFileSync(targetPath+'/'+ component, readFileSync(sourcePath+ '/'+component));
                }
            } else {
                if (!existsSync(targetPath+'/'+ component)) {
                    mkdir.sync(targetPath+'/'+ component);
                }
                
                copydir.sync(sourcePath+ '/'+component, targetPath+'/'+ component);
            }
        });
    }
}


// 复制Ui的文件到src中
const copyUiToSrc = (globalConfig) => {
    Object.keys(UI_COMPONENTS).forEach((ui) => {
        // const UI_PATH = eval(`require.resolve('${ui}-weapp/package.json').replace(/package.json$/, '')`);
        const UI_VERISON = eval(`require('${ui}-weapp/package.json').version`);
        // const sourcePath = join(UI_PATH, UI_SOURCE_DIR)
        const targetPath = join('src', TARGET_DIR_NAME, ui)
        const versionPath = join(targetPath, VERSION_FILE_NAME)

        // 检测src目录下的副本
        if (existsSync(targetPath) && existsSync(versionPath)) {
            const copyVersion = readFileSync(versionPath, 'utf-8')
            if (copyVersion === UI_VERISON) return // 比对版本
        }

        if (globalConfig[ui].inject instanceof Array) {
            let components = globalConfig[ui].inject;
            
            copyUiComponents(ui, components)
        } else if (globalConfig[ui].inject === true) {
            copyUiComponents(ui, [])
        }
        if (!existsSync(targetPath)) {
            mkdir.sync(targetPath);
        }
        writeFileSync(versionPath, UI_VERISON) // 添加版本文件
    })

    addCopyFolderToGitIgnore() // 把复制过去的文件夹添加.gitignore
}

// 添加git忽略
const addCopyFolderToGitIgnore = () => {
    if (!existsSync('.gitignore')) {
        writeFileSync('.gitignore', 'src/' + TARGET_DIR_NAME + '/')
    } else {
        let ignore = readFileSync('.gitignore', 'utf-8')
        if (!ignore.match('src/' + TARGET_DIR_NAME)) {
            ignore += '\nsrc/' + TARGET_DIR_NAME + '/'
            writeFileSync('.gitignore', ignore)
        }
    }
}

export {
    copyUiToSrc,
    copyUiComponents
}

export default {
    copyUiToSrc,
    copyUiComponents
}