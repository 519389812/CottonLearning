import { _decorator, Component, Node, Label } from 'cc';
import { ItemStatusEnum, TriggerEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { TriggerManager } from './TriggerManager';
const { ccclass, property } = _decorator;

@ccclass('GrandmaTriggerManager')
export class GrandmaTriggerManager extends TriggerManager {

    // 老太太的对话显示node
    @property({type: Node})
    dialogNode: Node = null;

    // 老太太显示文本node
    @property({type: Node})
    labelNode: Node = null;

    // 老太太被触发前的对白
    pendingDialog: Array<string> = [
        "我年纪大了，很多事情想不起来了。",
        "你是谁？算了，我也不在乎你是谁。你能帮我找到信箱的钥匙吗？",
        "老头子说最近会给我寄船票过来，叫我和他一起出去看看。虽然我没有什么兴趣...",
        "他折腾了一辈子，不是躲在楼上捣鼓什么时间机器，就是出海找点什么东西。",
        "这些古怪的电视节目真没有什么意思。",
        "老头子说这个岛上有很多秘密，其实我知道，不过是岛上的日子太孤独，他找点事情做罢了。",
        "人嘛，谁没有年轻过。年轻的时候...算了，不说这些往事了。",
        "老了才明白，万物静默如迷。",
    ];

    // 老太太被触发后的对白
    triggerDialog: Array<string> = [
        "没想到老头子的船票寄过来了，谢谢你。",
    ];

    onLoad() {
        super.onLoad();
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.render();
    }

    onDestroy() {
        super.onDestroy();
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    
    // 老太太渲染方法,即对白显示
    render() {
        if (DataManager.instance.grandmaTriggerIndex == -1) {
            this.dialogNode.active = false;
        } else {
            this.dialogNode.active = true;
            if (DataManager.instance.isGrandmaTrigger == TriggerEnum.pending){
                this.labelNode.getComponent(Label).string = this.pendingDialog[DataManager.instance.grandmaTriggerIndex]
            } else {
                this.labelNode.getComponent(Label).string = this.triggerDialog[DataManager.instance.grandmaTriggerIndex]
            }
        }
    }

    // 老太太被点击的处理方法,即讲到第几句对白,以及触发(给与船票)处理逻辑
    onTouchEnd() {
        if (DataManager.instance.currentInventoryItem == "mail" && DataManager.instance.isSelectItem == true){
            DataManager.instance.isGrandmaTrigger = TriggerEnum.resolved;
            DataManager.instance.grandmaTriggerIndex = 0;
            const items = DataManager.instance.items;
            items.get("mail").status = ItemStatusEnum.disable;
            DataManager.instance.items = items;
            DataManager.instance.isSelectItem = false;
        } else {
            if (DataManager.instance.isGrandmaTrigger == TriggerEnum.pending) {
                if(DataManager.instance.grandmaTriggerIndex >= this.pendingDialog.length - 1) {
                    DataManager.instance.grandmaTriggerIndex = -1;
                }else{
                    DataManager.instance.grandmaTriggerIndex ++;
                }
            } else {
                if(DataManager.instance.grandmaTriggerIndex >= this.triggerDialog.length - 1) {
                    DataManager.instance.grandmaTriggerIndex = -1;
                }else{
                    DataManager.instance.grandmaTriggerIndex ++;
                }
            }
        }

    }
}


