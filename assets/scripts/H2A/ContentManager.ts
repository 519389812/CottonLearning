import { _decorator, Component, Node, SpriteFrame, CCInteger } from 'cc';
import { DataManager } from '../runtime/DataManager';
import { RenderManager } from '../runtime/RenderManager';
const { ccclass, property } = _decorator;

@ccclass('ContentManager')
export class ContentManager extends RenderManager {
    // index用于判断是否在正确的位置
    @property({type: Number})
    index: number;

    // 错误位置时的图片
    @property({type: SpriteFrame})
    wrongSF: SpriteFrame = null;

    // 正确位置时的图片
    @property({type: SpriteFrame})
    correctSF:  SpriteFrame = null;
    
    render() {
        
    }
}


