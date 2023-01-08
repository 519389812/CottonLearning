import { _decorator, Component, Node } from 'cc';
import { ItemStatusEnum, TriggerEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { TriggerManager } from './TriggerManager';
const { ccclass, property } = _decorator;

@ccclass('MailBoxTriggerManager')
export class MailBoxTriggerManager extends TriggerManager {
    onLoad() {
        super.onLoad();
        this.render();
        this.pendingNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this.pendingNode);
    }

    onDisable() {
        this.pendingNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this.pendingNode);
    }

    onDestroy() {
        super.onDestroy();
    }

    // 邮箱的渲染方法
    render() {
        const isTrigger = DataManager.instance.isMailBoxTrigger == TriggerEnum.resolved;
        this.pendingNode.active = !isTrigger;
        this.resolvedNode.active = isTrigger;
    }

    // 邮箱被点击后的处理
    onTouchEnd() {
        if (DataManager.instance.currentInventoryItem == "key" && DataManager.instance.isSelectItem) {
            DataManager.instance.isMailBoxTrigger = TriggerEnum.resolved;
            const items = DataManager.instance.items;
            items.get("mail").status = ItemStatusEnum.scene;
            items.get("key").status = ItemStatusEnum.disable;
            DataManager.instance.items = items;
            DataManager.instance.currentInventoryItem = null;
            DataManager.instance.isSelectItem = false;
        }
    }
}


