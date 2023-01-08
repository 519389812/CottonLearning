import { _decorator, Component, Node, director, Prefab, instantiate } from 'cc';
import { SceneEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { RenderManager } from '../runtime/RenderManager';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends RenderManager {
    // 有哪些场景,需要被预加载的
    preloadSceneArray = ["H1", "H2", "H3", "H4", "H2A"];
    // 是否启用预加载
    isPreloadScene: Boolean = false;

    // 背包的Prefab,指定了背包在场景中就会渲染背包.如果不指定,如在H2A小游戏中,则不需渲染
    @property({type: Prefab})
    inventoryPerfab: Prefab = null;

    // 菜单按钮的Prefab,逻辑同上
    @property({type: Prefab})
    menuButtonPerfab: Prefab = null;

    onLoad(){
        super.onLoad();

        // 渲染背包
        if (this.inventoryPerfab) {
            const inventory = instantiate(this.inventoryPerfab);
            this.node.addChild(inventory);
        }

        // 渲染菜单按钮
        if (this.menuButtonPerfab) {
            const menuButton = instantiate(this.menuButtonPerfab);
            this.node.addChild(menuButton);
        }
    }

    start() {
        if (this.isPreloadScene) {
            this.preloadScene();
        }
    }

    // 预加载场景,isPreloadScene=true时预加载
    preloadScene() {
        for (let s of this.preloadSceneArray) {
            director.preloadScene(s);
        }
    }

    // 切换场景的方法
    changeScene(e: Event, sceneName: string) {
        DataManager.instance.currentScene = sceneName as SceneEnum;
    }

    // 渲染方法
    render() {
        if (director.getScene().name == DataManager.instance.currentScene) {
            return;
        }
        director.loadScene(DataManager.instance.currentScene);
    }
}


