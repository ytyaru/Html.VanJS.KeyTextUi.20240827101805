;(function(){
class Pager {
    constructor(options) {
        this._num = {row:7} // 要素数
        this._size = {height:24} // 要素の高さ
        this._onShow = this.#onShow.bind(this) // 要素に表示するテキストを返す関数
        this._el = null
        if (Array.isArray(options)) {this.items=options}
        else if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
    }
    get el() { return this._el }
    get items( ) { return this._items }
    set items(v) { if (Array.isArray(v)) { this._items = v; this._el=this.#make(); } }
    get row( ) { return this._num.row }
    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row = v } }
    get height( ) { return this._size.height }
    set height(v) { if(Number.isFinite(v) && 0<v) { this._size.height = v } }
    get onShow( ) { return this._onShow }
    set onShow(v) { if('function'===typeof v) { this._onShow = v } }
    #make(){return van.tags.ol({style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:auto;`}, this._items.map((v,i)=>van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(v))))}
    #onShow(data) { return data.toString() }
}
/*
class Item {
    constructor(options) {
        this._data = null // 要素のデータ(IDや任意インスタンス等)
        this._size = {height:24} // 要素の高さ
        this._onShow = this.#onShow.bind(this)
    }
    get height( ) { return this._size.height }
    set height(v) { if(Number.isFinite(v) && 0<v) { this._size.height = v } }
    get onShow( ) { return this._onShow }
    set onShow(v) { if('function'===typeof v) { this._onShow = v } }
    //make(){return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, v)))}
    make(){return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(this._data))))}
    #onShow(data) { return data.toString() }
}
*/
window.Pager = Pager
})();
