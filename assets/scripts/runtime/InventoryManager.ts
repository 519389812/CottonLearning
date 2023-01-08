import { _decorator, Component, Node, Sprite, Button, director, Label } from 'cc';
import { ItemStatusEnum } from '../enum';
import { Singleton } from '../singleton/Singleton';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { RenderManager } from './RenderManager';
const { ccclass, property } = _decorator;

@ccclass('InventoryManager')
export class InventoryManager extends RenderManager {

    // 背包节点
    @property({type: Node})
    inventoryNode: Node = null;

    // 控制背包左右选择的按钮
    @property({type: Node})
    leftButton: Node = null;

    // 控制背包左右选择的按钮
    @property({type: Node})
    rightButton: Node = null;

    // 背包显示物品的节点
    @property({type: Node})
    inventoryItemNode: Node = null;

    // 选择手的节点
    @property({type: Node})
    handNode: Node = null;

    // 背包上方显示物品名称的节点
    @property({type: Node})
    labelNode: Node = null;

    onLoad(){
        super.onLoad();
        this.render();
    }

    onDestroy() {
        super.onDestroy();
    }

    // 从DataManager中获取背包物品
    getInventoryArray(): Array<string> {
        const inventoryArray = new Array();
        for (let [k, v] of DataManager.instance.items) {
            if (v.status == ItemStatusEnum.inventory){
                inventoryArray.push(k);
            }
        }
        return inventoryArray;
    }

    // 渲染背包物品
    render() {
        const inventoryArray = this.getInventoryArray()
        if(inventoryArray.length > 0){
            this.inventoryItemNode.getComponent(Sprite).spriteFrame = null;
            this.inventoryNode.active = true;
            if (!DataManager.instance.currentInventoryItem) {
                DataManager.instance.currentInventoryItem = inventoryArray[0];
            } 
            this.inventoryItemNode.getComponent(Sprite).spriteFrame = DataManager.instance.itemInventorySF.get(DataManager.instance.currentInventoryItem);
            this.labelNode.getComponent(Label).string = DataManager.instance.items.get(DataManager.instance.currentInventoryItem).label;
            let index = inventoryArray.findIndex(i=>i == DataManager.instance.currentInventoryItem);
            this.buttonInteractable(index, inventoryArray.length);
        }else{
            this.inventoryNode.active = false;
        }
        this.handNode.active = Boolean(DataManager.instance.isSelectItem);
    }

    // 判断左右按钮是否可以被按下,即选择第一个物品时无法向左翻,最后一个物品时不能向右翻
    buttonInteractable(index, totalLength) {
        if (index <= 0) {
            this.leftButton.getComponent(Button).interactable = false;
        } else {
            this.leftButton.getComponent(Button).interactable = true;
        }
        if (index >= totalLength - 1) {
            this.rightButton.getComponent(Button).interactable = false;
        } else {
            this.rightButton.getComponent(Button).interactable = true;
        }
    }

    // 左翻页按钮处理方法
    handleLeftButton(e: Event) {
        const inventoryArray = this.getInventoryArray();
        if (inventoryArray.length > 0) {
            if (!DataManager.instance.currentInventoryItem) {
                DataManager.instance.currentInventoryItem = inventoryArray[0];
            }
            let index = inventoryArray.findIndex(i=>i == DataManager.instance.currentInventoryItem);
            this.buttonInteractable(index, inventoryArray.length);
            if (index > 0) {
                DataManager.instance.currentInventoryItem = inventoryArray[index - 1];
            }
        } else {
            this.leftButton.getComponent(Button).interactable = false;
        }
    }

    // 右翻页按钮处理方法
    handleRightButton(e: Event) {
        const inventoryArray = this.getInventoryArray();
        if (inventoryArray.length > 0) {
            if (!DataManager.instance.currentInventoryItem) {
                DataManager.instance.currentInventoryItem = inventoryArray[0];
            }
            let index = inventoryArray.findIndex(i=>i == DataManager.instance.currentInventoryItem);
            this.buttonInteractable(index, inventoryArray.length);
            if (index < inventoryArray.length - 1) {
                DataManager.instance.currentInventoryItem = inventoryArray[index + 1];
            }
        } else {
            this.rightButton.getComponent(Button).interactable = false;
        }
    }

    // 点击物品的方法
    inventoryButton(e: Event) {
        DataManager.instance.isSelectItem = !DataManager.instance.isSelectItem;
    }
}


