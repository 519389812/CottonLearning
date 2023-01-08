import { _decorator, Component, Node } from 'cc';
import { EventEnum } from '../enum';
import { Singleton } from '../singleton/Singleton';
const { ccclass, property } = _decorator;

interface eventContent {
    eventFunc: Function,
    ctx: any,
}

@ccclass('EventManager')
export class EventManager extends Singleton {   
    // 事件实例化
    static get instance() {
        return this.getInstance<EventManager>();
    }

    // 储存所有事件的map
    private _eventMap: Map<EventEnum, Array<eventContent>> = new Map();

    get eventMap() {
        return this._eventMap;
    }

    set eventMap(newData) {
        this.eventMap = newData;
    }

    // 需要渲染的节点，在onLoad时注册在eventMap中
    on(eventName: EventEnum, eventFunc: Function, ctx?: any) {
        if (this._eventMap.has(eventName)) {
            // 已经有相同方法，不用重复保存
            if (this._eventMap.get(eventName).findIndex(i=>i.ctx._id == ctx._id && i.eventFunc == eventFunc) != -1) {
                // let index = this._eventMap.get(eventName).findIndex(i=>i.eventFunc == eventFunc && i.ctx._id == ctx._id);
                // this._eventMap.get(eventName).splice(index, 1);
                return;
            }
            this._eventMap.get(eventName).push({eventFunc, ctx});
        } else {
            this._eventMap.set(eventName, [{eventFunc, ctx}]);
        }
    }

    // 需要渲染的节点，在onDestroy时取消注册
    off(eventName: EventEnum, eventFunc: Function, ctx?: any) {
        if (this._eventMap.has(eventName)) {
            let index = this._eventMap.get(eventName).findIndex(i=>i.eventFunc == eventFunc && i.ctx._id == ctx._id);
            this._eventMap.get(eventName).splice(index, 1);
        }
    }

    // 触发渲染方法
    emit(eventName: EventEnum, ...params: string[]) {
        this._eventMap.get(eventName).forEach(({eventFunc, ctx}) => {
            ctx ? eventFunc.apply(ctx, ...params) : eventFunc(...params);
        })
    }
}


