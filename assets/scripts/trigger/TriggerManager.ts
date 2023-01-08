import { _decorator, Component, Node } from 'cc';
import { DataManager } from '../runtime/DataManager';
import { RenderManager } from '../runtime/RenderManager';
const { ccclass, property } = _decorator;

// 需要被触发对象的基类
@ccclass('TriggerManager')
export class TriggerManager extends RenderManager {

    // 触发前的node
    @property({type: Node})
    pendingNode: Node = null;

    // 触发后的node
    @property({type: Node})
    resolvedNode: Node = null;
    
    render() {}
}


