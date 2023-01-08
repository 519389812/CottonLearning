import { _decorator, Component, Node } from 'cc';
import { ItemStatusEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { ItemManager } from './ItemManager';
const { ccclass, property } = _decorator;

// 继承ItemManager
@ccclass('KeyItemManager')
export class KeyItemManager extends ItemManager {
    itemLabel: string = "钥匙";

    itemName: string = "key";

    itemStatus: ItemStatusEnum = ItemStatusEnum.scene;

}


