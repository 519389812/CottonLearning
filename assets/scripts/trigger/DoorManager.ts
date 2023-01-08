import { _decorator, Component, Node, director } from 'cc';
import { SceneEnum, TriggerEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { RenderManager } from '../runtime/RenderManager';
const { ccclass, property } = _decorator;

@ccclass('DoorManager')
export class DoorManager extends RenderManager {

    onLoad() {
        super.onLoad();
        this.render();
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        super.onDestroy();
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // 渲染门的方法
    render() {
        if (DataManager.instance.isDoorTrigger == TriggerEnum.pending) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    // 点击门的处理方法
    onTouchEnd() {
        DataManager.instance.currentScene = SceneEnum.H2A;
    }
}


