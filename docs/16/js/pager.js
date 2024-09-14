;(function(){
class Pager {
    constructor(options) {
        /*
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
        */
        this._list = new List(options)
        this._page = new Paginator()
        this._page.all = Math.ceil(this.list.items.length / this.list.row)
        this._page.onSetNow = (now,all)=>{
            this._list.el.children[this._list.row*(now-1)].scrollIntoView()
        }
        this._page.onSetAll = (now,all)=>{

        }
        this._list.onWheelUp = (e)=>{
            this._page.now--
        }
        this._list.onWheelDown = (e)=>{
            this._page.now++
        }
        this._el = this.#make()
    }
    get el() { return this._el }
    #make() { return van.tags.div(()=>this._list.el, ()=>this._page.el) }
    get list() {return this._list }
    get page() {return this._page }
    /*
    get el() { return this._el }
    get items( ) { return this._items }
    //set items(v) { if (Array.isArray(v)) { this._items = v; this._el=this.#make(); } }
    set items(v) { if (Array.isArray(v)) { this.#delEvent(); this._items=v; this._el=this.#make(); this.#addEvent(); } }
    get row( ) { return this._num.row }
    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row = v } }
    get height( ) { return this._size.height }
    set height(v) { if(Number.isFinite(v) && 0<v) { this._size.height = v } }
    get onShow( ) { return this._onShow }
    set onShow(v) { if('function'===typeof v) { this._onShow = v } }
    get selected() { return this.#lis.filter((li,i)=>i===this._y)[0] }
    get selectedIndex() { return this.#lis.filter((li,i)=>i===this._y)[1] }
    get #lis() { return [...this.el.children] } // [...this.el.querySelectorAll(`li`)]
    #make(){return van.tags.ol({style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:hidden;`}, this._items.map((v,i)=>van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(v))))}
    #onShow(data) { return data.toString() }
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
        this._y = [...e.target.parentElement.children].indexOf(e.target)
        console.log(`MouseEnter: y=${this._y}`)
        this.#show()
    }
    #onMouseLeave(e) {
        console.log(`MouseLeave:`, e)
        this.#clear()
    }
    #onWheel(e) {
        console.log(`MouseLeave:`, e)
    }
    #addEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
        this.#lis.map(li=>li.addEventListener('wheel', this.#onWheel.bind(this)))
    }
    #delEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
        this.#lis.map(li=>li.removeEventListener('wheel', this.#onWheel.bind(this)))
    }
    #show() {this.#clear(); this.selected.classList.add('selected');}
    #clear() {this.#lis.filter(li=>li.classList.contains('selected')).map(li=>li.classList.remove('selected'))}
    */
}
class List {
    constructor(options) {
        this._num = {row:7} // 要素数
        this._size = {height:24} // 要素の高さ
        this._onShow = this.#onShow.bind(this) // 要素に表示するテキストを返す関数
        this._el = null
        this._items = van.state([])
        this._onWheelUp = (e)=>{}
        this._onWheelDown = (e)=>{}
        this._onWheelLeft = (e)=>{}
        this._onWheelRight = (e)=>{}
        if (Array.isArray(options)) {this.items.val=options}
        else if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
    }
    get el() { return this._el }
    get items( ) { return this._items.val }
    set items(v) { if (Array.isArray(v)) { this.#delEvent(); this._items.val=v; this._el=this.#make(); this.#addEvent(); } }
    get row( ) { return this._num.row }
    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row = v } }
    get height( ) { return this._size.height }
    set height(v) { if(Number.isFinite(v) && 0<v) { this._size.height = v } }
    get onShow( ) { return this._onShow }
    set onShow(v) { if('function'===typeof v) { this._onShow = v } }
    get onWheelUp( ) { return this._onWheelUp }
    set onWheelUp(v) { if('function'===typeof v){this._onWheelUp=v} }
    get onWheelDown( ) { return this._onWheelDown }
    set onWheelDown(v) { if('function'===typeof v){this._onWheelDown=v} }
    get onWheelLeft( ) { return this._onWheelLeft }
    set onWheelLeft(v) { if('function'===typeof v){this._onWheelLeft=v} }
    get onWheelRight( ) { return this._onWheelRight }
    set onWheelRight(v) { if('function'===typeof v){this._onWheelRight=v} }
    #onShow(data) { return data.toString() }
    #make(){return van.tags.ol({style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:auto;`}, this._items.val.map((v,i)=>van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(v))))}
    get #lis() { return [...this.el.children] } // [...this.el.querySelectorAll(`li`)]
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
        this._y = [...e.target.parentElement.children].indexOf(e.target)
        //this.#lis.map((li,i)=>[li,i]).filter((li,i)=>li===e.target)
        console.log(`MouseEnter: y=${this._y}`)
        this.#show()
    }
    #onMouseLeave(e) {
        console.log(`MouseLeave:`, e)
        this.#clear()
    }
    #onWheel(e) {
        console.log(`Wheel:`, e)
        if (e.deltaY<0) { this.onWheelUp(e) }
        else if (0<e.deltaY) { this.onWheelDown(e) }
        else if (e.deltaX<0) { this.onWheelLeft(e) }
        else if (0<e.deltaX) { this.onWheelRight(e) }
        e.preventDefault()
    }
    #onMouseUp(e) {
        console.log(`MouseUp:`, e)
             if (0===e.button) {console.log(`マウス左ボタン押下`)}
        else if (1===e.button) {console.log(`マウス中ボタン押下`)}
        else if (2===e.button) {console.log(`マウス右ボタン押下`)}
        else if (3===e.button) {console.log(`マウス戻るボタン押下`)}
        else if (4===e.button) {console.log(`マウス進むボタン押下`)}
        else {console.log(`不明なマウスボタンを押下した。`)}
    }
    #addEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
//        this.#lis.map(li=>li.addEventListener('wheel', this.#onWheel.bind(this)))
        this.el.addEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.el.addEventListener('mouseup', this.#onMouseUp.bind(this))
    }
    #delEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
//        this.#lis.map(li=>li.removeEventListener('wheel', this.#onWheel.bind(this)))
        this.el.removeEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.el.removeEventListener('mouseup', this.#onMouseUp.bind(this))
    }
    get selected() { return this.#lis.filter((li,i)=>i===this._y)[0] }
    get selectedIndex() { return this.#lis.filter((li,i)=>i===this._y)[1] }
    #show() {this.#clear(); this.selected.classList.add('selected');}
    #clear() {this.#lis.filter(li=>li.classList.contains('selected')).map(li=>li.classList.remove('selected'))}
}

class Paginator {
    constructor(options) {
        this._now = van.state(1)
        this._all = van.state(1)
        this._onSetNow = ()=>{}
        this._onSetAll = ()=>{}
        if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
        this._el = this.#make()
    }
    get now( ) { return this._now.val }
    set now(v) {
        if (Number.isInteger(v)) {
            if (v<1) {this._now.val=this._all.val}
            else if (this.all<v) {this._now.val=1}
            else {this._now.val=v}
            this._onSetNow(this.now, this.all)
        }
    }
    get all( ) { return this._all.val }
    set all(v) { if (Number.isInteger(v) && 0<v) {this._all.val=v;this._onSetAll(this.now, this.all)} }

    get onSetNow( ) { return this._onSetNow }
    set onSetNow(v) { if('function'===typeof v){this._onSetNow=v} }
    get onSetAll( ) { return this._onSetAll }
    set onSetAll(v) { if('function'===typeof v){this._onSetAll=v} }

    get el() { return this._el }
    #make() {
        return van.tags.div({}, 
            van.tags.button({onclick:(e)=>--this.now}, '◀'),
            ()=>`${this.now}/${this.all}`,
            van.tags.button({onclick:(e)=>++this.now}, '▶'))
    }
}
class Cursor {
    constructor(options) {
        this._items = null
        this._y = 0
    }
    get items( ) { return this._items }
    set items(v) { if (Array.isArray(v)) { this._items = v; } }
    get selected() { return this._items[this._y] }
    get y( ) { return this._y }
    set y(v) {
        if (Number.isInteger(v)) {
            if (v<0) {this._y=this._items.length-1}
            else if (this._items.length<=v) {this._y=0}
            else {this._y=v}
        }
    }
}
/*
class Page {
    constructor(options) {
        this._now = 1
        this._all = 1
    }
    get now( ) { return this._now }
    set now(v) {
        if (Number.isInteger(v)) {
            if (v<1) {this._now=this._all}
            else if (this._all<v) {this._now=1}
            else {this._now=v}
        }
    }
    get all( ) { return this._all }
    set all(v) { if (Number.isInteger(v) && 0<v) {this._all=v} }
}
class Paginator {
    constructor(options) {
        this._page = new Page()
    }
    get el() { return this._el }
    get page() { return this._page }
    #make() {
        return van.tags.div({}, 
            van.tags.button({onclick:(e)=>--this.page}, '◀'),
            ()=>`${this._page.now}/${this._page.all}`,
            van.tags.button({onclick:(e)=>++this.page}, '▶'))
    }
}
*/
/*
class List {
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
    set items(v) { if (Array.isArray(v)) { this.#delEvent(); this._items=v; this._el=this.#make(); this.#addEvent(); } }
    get row( ) { return this._num.row }
    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row = v } }
    get height( ) { return this._size.height }
    set height(v) { if(Number.isFinite(v) && 0<v) { this._size.height = v } }
    get onShow( ) { return this._onShow }
    set onShow(v) { if('function'===typeof v) { this._onShow = v } }
    #onShow(data) { return data.toString() }
    #make(){return van.tags.ol({style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:auto;`}, this._items.map((v,i)=>van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(v))))}
    get #lis() { return [...this.el.children] } // [...this.el.querySelectorAll(`li`)]
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
        this._y = [...e.target.parentElement.children].indexOf(e.target)
        //this.#lis.map((li,i)=>[li,i]).filter((li,i)=>li===e.target)
        console.log(`MouseEnter: y=${this._y}`)
        this.#show()
    }
    #onMouseLeave(e) {
        console.log(`MouseLeave:`, e)
        this.#clear()
    }
    #addEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    #delEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    get selected() { return this.#lis.filter((li,i)=>i===this._y)[0] }
    get selectedIndex() { return this.#lis.filter((li,i)=>i===this._y)[1] }
    #show() {this.#clear(); this.selected.classList.add('selected');}
    #clear() {this.#lis.filter(li=>li.classList.contains('selected')).map(li=>li.classList.remove('selected'))}
}
*/
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
window.List = List
})();
