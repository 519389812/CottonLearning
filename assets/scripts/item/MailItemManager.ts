import { _decorator, Component, Node } from 'cc';
import { ItemStatusEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { ItemManager } from './ItemManager';
const { ccclass, property } = _decorator;

@ccclass('MailItemManager')
export class MailItemManager extends ItemManager {
    itemLabel: string = "船票";

    itemName: string = "mail";

    itemStatus: ItemStatusEnum = ItemStatusEnum.disable;

}


