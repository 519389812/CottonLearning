import { _decorator, Component, Node, director } from 'cc';
import { SceneEnum } from '../enum';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {
    // 事件拦截（event.propagationStopped = true），以防止事件穿透。
    // 如果是非按钮节点，也可以通过添加 BlockInputEvents 组件来对事件进行拦截，防止穿透。
    // 新游戏按钮
    newGameButton(e:Event) {
        // 直接用director.loadScene方法，防止在H1场景无法从DataManager中设置
        DataManager.instance.resetData();
        director.loadScene(SceneEnum.H1);
    }

    // 继续游戏按钮
    continueGameButton(e:Event) {
        DataManager.instance.restoreData();
        director.loadScene(DataManager.instance.currentScene);
    }
}


