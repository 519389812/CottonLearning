import { _decorator, Component, Node, Prefab, instantiate, find, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuButtonManager')
export class MenuButtonManager extends Component {
    // 菜单按钮的Prefab
    @property({type: Prefab})
    menuPrefab: Prefab = null;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // 点击菜单按钮的方法
    // 可以使用event传参
    onTouchEnd(e: Event) {
        if (find("Canvas/Menu") != null) {
            return;
        }
        let menuNode = instantiate(this.menuPrefab)
        find("Canvas").addChild(menuNode);
    }
}


