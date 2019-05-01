import './require-babel-polyfill';
import merge from 'deepmerge';
import { copyUiToSrc } from './copy';
import injectComponents from './inject';
import px2 from './px2';
import { DEFAULT_CONFIG } from './config';

export default class WepyPluginUi {
    constructor(c = {}) {
        c = merge(c, { isPx2On: c.config && c.config.px2 })
        this.setting = merge(DEFAULT_CONFIG, c);
        copyUiToSrc(this.setting.config); // 拷贝Ui组件到src下
    }
    apply(op) {
        // console.log('op', op);
        const setting = this.setting;
        const asyncApply = async () => {
            if (setting.isPx2On) {
                op = await px2(op, setting);
            }
            op = injectComponents(op, setting);
        }
        asyncApply().then(() => {
            op.next();
        })
    }
}
