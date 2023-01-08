import { _decorator, Component, Node } from 'cc';
import { EventEnum } from '../enum';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('RenderManager')
export abstract class RenderManager extends Component {
    // 继承该类表示节点需要渲染,在onload时将渲染方法注册到事件中心,即子类中的render方法
    onLoad() {
        EventManager.instance.on(EventEnum.render, this.render, this);
    }

    // 销毁节点时取消注册
    onDestroy() {
        EventManager.instance.off(EventEnum.render, this.render, this);
    }

    abstract render(): void;

}


