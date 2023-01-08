import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class Singleton extends Component {
    private static _instance: any = null;

    // 注意要用静态方法，类直接访问时，this才能指向类
    static getInstance<T>(): T {
        if (this._instance == null) {
            this._instance = new this();
        }
        return this._instance;
    }
}


