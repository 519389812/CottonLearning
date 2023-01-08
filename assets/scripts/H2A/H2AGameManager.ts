import { _decorator, Component, Node, Vec3, instantiate, Prefab, math, UITransform, SpriteFrame, Sprite, Event, director } from 'cc';
import { SceneEnum, TriggerEnum } from '../enum';
import { DataManager } from '../runtime/DataManager';
import { EventManager } from '../runtime/EventManager';
import { RenderManager } from '../runtime/RenderManager';
import { CircleManager } from './CircleManager';
import { ContentManager } from './ContentManager';
const { ccclass, property } = _decorator;

@ccclass('H2AGameManager')
export class H2AGameManager extends RenderManager {
    // type Array 必须用[content]的形式，用Array<content>报错
    // 所有圈的array
    @property({type: [CircleManager]})
    circles: Array<CircleManager> = new Array();

    // 生成连接线的prefab
    @property({type: Prefab})
    linePrefab: Prefab = null;

    // 圈的半径，生成线的时候，需要减去半径的长度
    circleR: number = 80;

    // 圈里面对应铭文的prefab，array
    @property({type: [Prefab]})
    circlePrefab: Array<Prefab> = new Array();

    start() {
        this.setCirclesLineMap();
        this.drawCirclesLine();
        this.checkCorrect();
        this.render();
    }

    // 记录每个圈，连接到哪些圈，用于划线
    circlesLineMap: Map<CircleManager, Array<CircleManager>> = new Map();
    setCirclesLineMap() {
        this.circlesLineMap.set(this.circles[0], [this.circles[1], this.circles[4], this.circles[6]]);
        this.circlesLineMap.set(this.circles[1], [this.circles[0], this.circles[5], this.circles[6]]);
        this.circlesLineMap.set(this.circles[2], [this.circles[4], this.circles[6]]);
        this.circlesLineMap.set(this.circles[3], [this.circles[5], this.circles[6]]);
        this.circlesLineMap.set(this.circles[4], [this.circles[0], this.circles[2], this.circles[5], this.circles[6]]);
        this.circlesLineMap.set(this.circles[5], [this.circles[1], this.circles[3], this.circles[4], this.circles[6]]);
        this.circlesLineMap.set(this.circles[6], [this.circles[0], this.circles[1], this.circles[2], this.circles[3], this.circles[4], this.circles[5]]);
    }

    // 划线
    drawCirclesLine() {
        for (let [startCircle, nextCircles] of this.circlesLineMap) {
            for (let nextCircle of nextCircles) {
                let {x: x1, y: y1} = startCircle.node.getPosition();
                let {x: x2, y: y2} = nextCircle.node.getPosition();
                let a = x2-x1;
                let b = y2-y1;
                let lineLength = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
                let linePosition = new Vec3(x1+a/2, y1+b/2, 0);
                // Math.sin 传入弧度 返回正弦值 Math.asin 传入正弦返回弧度
                // 计算角度公式 弧度 * 180 / pi
                // 判断两点的位置旋转是否超过90度
                if (x1 > x2) {
                    var lineAngle = - Math.round(Math.asin(b/lineLength) * 180 / Math.PI);
                } else {
                    var lineAngle = Math.round(Math.asin(b/lineLength) * 180 / Math.PI);
                }
                let lineNode = instantiate(this.linePrefab);
                lineNode.setPosition(linePosition);
                // 设置角度要用欧拉角，旋转Z轴
                lineNode.setRotationFromEuler(new Vec3(0, 0, lineAngle));
                let {width, height} = lineNode.getComponent(UITransform).contentSize;
                // 设置长度时，传入高度，保持原高，不传入将无法变形
                lineNode.getComponent(UITransform).setContentSize(new math.Size(lineLength - 2 * 80, height));
                lineNode.setParent(this.node);
            }
        }
    }

    // 页面渲染
    render() {
        for (let index in this.circles) {
            let prefabIndex = DataManager.instance.currentCircleList[index];
            this.circles[index].node.destroyAllChildren();
            if (prefabIndex != null) {
                let circleNode = instantiate(this.circlePrefab[prefabIndex]);
                if(prefabIndex == parseInt(index)) {
                    circleNode.getComponent(Sprite).spriteFrame = circleNode.getComponent(ContentManager).correctSF;
                }
                this.circles[index].node.destroyAllChildren();
                this.circles[index].node.addChild(circleNode);
            }
        }
    }

    // 检查游戏是否正解
    checkCorrect() {
        // 箭头函数 单行声明可以不加 大括号{} 和 return
        if(DataManager.instance.currentCircleList.every((v, i) => {return v == DataManager.instance._correctCircleList[i]})) {
            DataManager.instance.isDoorTrigger = TriggerEnum.resolved;
            DataManager.instance.currentScene = SceneEnum.H2;
        }
    }
    
    // 点击每个铭文的方法，移动铭文位置
    onTouchEnd(e: Event){
        // e.target返回eventTarget类型，可以直接转换为node类型，vscode报错需要引入Node
        let targetCircle = e.target as Node;
        let connectNodes = this.circlesLineMap.get(targetCircle.getComponent(CircleManager));
        let originIndex = this.circles.findIndex(i=>i == targetCircle.getComponent(CircleManager));
        if (DataManager.instance.currentCircleList[originIndex] == null) {
            return;
        }
        for (let n of connectNodes) {
            let index = this.circles.findIndex(i=>i == n)
            if (DataManager.instance.currentCircleList[index] == null) {
                DataManager.instance.currentCircleList[index] = DataManager.instance.currentCircleList[originIndex];
                DataManager.instance.currentCircleList[originIndex] = null;
                DataManager.instance.currentCircleList = [...DataManager.instance.currentCircleList]
            }
        }
        this.checkCorrect();
    }

    // 重置铭文位置
    resetContent(e: Event) {
        DataManager.instance.currentCircleList = [...DataManager.instance._initCircleList];
    }

    // 返回上一个场景
    backButton() {
        DataManager.instance.currentScene = SceneEnum.H2;
    }
}


