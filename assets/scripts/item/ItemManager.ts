import { _decorator, Component, Node, Prefab, SpriteFrame, instantiate, Sprite, Vec3 } from 'cc';
import { EventEnum, ItemStatusEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { EventManager } from '../runtime/EventManager';
import { RenderManager } from '../runtime/RenderManager';
import { KeyItemManager } from './KeyItemManager';
const { ccclass, property } = _decorator;

@ccclass('ItemManager')
export abstract class ItemManager extends RenderManager {
    // item显示在物品栏上方的名称
    abstract itemLabel: string;

    // item存储在DataManager中的索引
    abstract itemName: string;

    // 物品的初始状态
    abstract itemStatus: ItemStatusEnum;

    // 渲染物品的节点
    @property({type: Node})
    itemNode: Node = null;

    // 物品本省的prefab
    @property({type: Prefab})
    itemPrefab: Prefab = null;

    // 物品在场景中的图片
    @property({type: SpriteFrame})
    sceneSpriteFrame: SpriteFrame = null;

    // 物品在背包中的图片
    @property({type: SpriteFrame})
    inventorySpriteFrame: SpriteFrame = null;

    // 初始化时渲染物品
    initItem() {
        if (!DataManager.instance.items.has(this.itemName)){
            let items = DataManager.instance.items;
            items.set(this.itemName, {status: this.itemStatus, label: this.itemLabel});
            DataManager.instance.items = items;
            DataManager.instance.itemInventorySF = DataManager.instance.itemInventorySF.set(this.itemName, this.inventorySpriteFrame)
        }
    }

    onLoad() {
        super.onLoad();
        this.initItem();
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.render();
    }

    onDestroy() {
        super.onDestroy();
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // 渲染物品的方法
    render() {
        let itemStatus = DataManager.instance.items.get(this.itemName).status;
        switch (itemStatus) {
            case ItemStatusEnum.scene:
                let newNode = instantiate(this.itemPrefab);
                newNode.getComponent(Sprite).spriteFrame = this.sceneSpriteFrame;
                this.itemNode.addChild(newNode);
                newNode.setPosition(new Vec3(0,0,0));
                break;
            case ItemStatusEnum.inventory:
                this.itemNode.destroyAllChildren();
                break;
            default:
                break;
        }
    }

    // 点击物品的处理方法
    onTouchEnd(){
        let itemStatus = DataManager.instance.items.get(this.itemName).status;
        switch (itemStatus) {
            case ItemStatusEnum.scene:
                let items = DataManager.instance.items;
                items.set(this.itemName, {status: ItemStatusEnum.inventory, label: this.itemLabel});
                DataManager.instance.items = items;
            default:
                break;
        }
    }
}
