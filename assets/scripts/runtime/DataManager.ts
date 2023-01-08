import { _decorator, Component, SpriteFrame, sys } from 'cc';
import { EventEnum, ItemStatusEnum, SceneEnum, TriggerEnum } from '../enum';
import { Singleton } from '../singleton/Singleton';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

interface ItemContent {
    status: ItemStatusEnum,
    label: string,
}

const LOCAL_DATA: string = "Data";

@ccclass('DataManager')
export class DataManager extends Singleton {
    // 实例
    static get instance() {
        return this.getInstance<DataManager>();
    }

    // 储存物品在背包中的图片，在背包时渲染，若储存在DataManager的数据中，储存占用太大，因此单独放在一个变量中，不用作为数据存储在本地，需要渲染时提取即可
    private _itemInventorySF: Map<string, SpriteFrame> = new Map();

    get itemInventorySF() {
        return this._itemInventorySF;
    }

    set itemInventorySF(newData) {
        this._itemInventorySF = newData;
    }

    // 物品的数据，记录物品的状态和显示在背包上方的名称
    private _items: Map<string, ItemContent> = new Map();

    get items() {
        return this._items;
    }

    set items(newData) {
        this._items = newData;
        this.render();
    }

    // 当前选择的物品
    private _currentInventoryItem: string = null;

    get currentInventoryItem() {
        return this._currentInventoryItem;
    }

    set currentInventoryItem(newData) {
        this._currentInventoryItem = newData;
        this.render();
    }

    // 是否选中了需要使用的物品，即手的图标
    private _isSelectItem: Boolean = false;

    get isSelectItem() {
        return this._isSelectItem;
    }

    set isSelectItem(newData) {
        this._isSelectItem = newData;
        this.render();
    }

    // 邮箱是否被触发，即打开
    private _isMailBoxTrigger: string = TriggerEnum.pending;

    get isMailBoxTrigger() {
        return this._isMailBoxTrigger;
    }

    set isMailBoxTrigger(newData) {
        this._isMailBoxTrigger = newData;
        this.render();
    }

    // 老太太是否被触发，即给予了船票
    private _isGrandmaTrigger: string = TriggerEnum.pending;

    get isGrandmaTrigger() {
        return this._isGrandmaTrigger;
    }

    set isGrandmaTrigger(newData) {
        this._isGrandmaTrigger = newData;
        this.render();
    }

    // 记录老太太说到第几句对白
    private _grandmaTriggerIndex: number = -1

    get grandmaTriggerIndex() {
        return this._grandmaTriggerIndex;
    }

    set grandmaTriggerIndex(newData) {
        this._grandmaTriggerIndex = newData;
        this.render();
    }

    // 初始铭文的顺序，重置时用
    readonly _initCircleList: Array<number> = [1, 0, 3, 2, 5, 4, null];
    // 正确的铭文顺序
    readonly _correctCircleList: Array<number> = [0, 1, 2, 3, 4, 5, null];
    // 当前铭文顺序
    private _currentCircleList: Array<number> = this._initCircleList;

    get currentCircleList() {
        return this._currentCircleList;
    }

    set currentCircleList(newData) {
        this._currentCircleList = newData;
        this.render();
    }

    // H2场景的门是否被打开
    private _isDoorTrigger: TriggerEnum = TriggerEnum.pending;

    get isDoorTrigger() {
        return this._isDoorTrigger;
    }

    set isDoorTrigger(newData) {
        this._isDoorTrigger = newData;
        this.render();
    }

    // 当前场景
    private _currentScene: SceneEnum = SceneEnum.H1

    get currentScene() {
        return this._currentScene;
    }

    set currentScene(newData) {
        this._currentScene = newData;
        this.render();
    }

    // 因为物品的状态时map状态，map在保存为json数据时会有问题，因此先转为object
    // map to json 要先把map转为object
    mapToJson(map){
        let obj = Object.create(null);
        for (let [k, v] of map) {
            obj[k] = v;
        }
        return JSON.stringify(obj);
   }

   jsonToMap(jsonString){
        let jsonObj = JSON.parse(jsonString)
        let map = new Map();
        for (let k of Object.keys(jsonObj)) {
            map.set(k, jsonObj[k]);
        }
        return map;
    }

    // 渲染，每次渲染都保存一次数据
    render() {
        this.saveData();
        EventManager.instance.emit(EventEnum.render);
    }

    // 保存数据到本地
    saveData() {
        let jsonData = JSON.stringify({
            items: this.mapToJson(this._items),
            currentInventoryItem: this._currentInventoryItem,
            isSelectItem: this._isSelectItem,
            isMailBoxTrigger: this._isMailBoxTrigger,
            isGrandmaTrigger: this._isGrandmaTrigger,
            grandmaTriggerIndex: this._grandmaTriggerIndex,
            currentCircleList: this._currentCircleList,
            isDoorTrigger: this._isDoorTrigger,
            currentScene: this._currentScene,
        })
        sys.localStorage.setItem(LOCAL_DATA, jsonData);
    }

    // 选择新游戏时重置数据
    resetData() {
        this._items = new Map();
        this._currentInventoryItem = null;
        this._isSelectItem = false;
        this._isMailBoxTrigger = TriggerEnum.pending;
        this._isGrandmaTrigger = TriggerEnum.pending;
        this._grandmaTriggerIndex = -1;
        this._currentCircleList = this._initCircleList;
        this._isDoorTrigger = TriggerEnum.pending;
        this._currentScene = SceneEnum.H1;
    }

    // 继续游戏时，读取保存在本地的数据
    restoreData() {
        let jsonData = sys.localStorage.getItem(LOCAL_DATA);
        let data = JSON.parse(jsonData);
        this._items = this.jsonToMap(data.items);
        this._currentInventoryItem = data.currentInventoryItem;
        this._isSelectItem = data.isSelectItem;
        this._isMailBoxTrigger = data.isMailBoxTrigger;
        this._isGrandmaTrigger = data.isGrandmaTrigger;
        this._grandmaTriggerIndex = data.grandmaTriggerIndex;
        this._currentCircleList = data.currentCircleList;
        this._isDoorTrigger = data.isDoorTrigger;
        this._currentScene = data.currentScene;
    }
}


