;(function(){
class Pager {
    constructor(options) {
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
        this._list.onKeyDown = (e)=>{
                 if ('ArrowUp'===e.key) {this._list.y--;this.#show();}
            else if ('ArrowDown'===e.key) {this._list.y++;this.#show();}
            else if ('ArrowLeft'===e.key) {}
            else if ('ArrowRight'===e.key) {}
            else if (' '===e.key && e.shiftKey) {this._page.now--}
            else if (' '===e.key) {this._page.now++}
            else if ('PageUp'===e.key) {this._page.now--}
            else if ('PageDown'===e.key) {this._page.now++}
            else {}
        }
        /*
        this._list.onKeyDownlUp = (e)=>{
            //this._page.now--
            this._list.y--
        }
        this._list.onKeyDownDown = (e)=>{
            //this._page.now++
            this._list.y++
        }
        this._list.onKeyDownShiftSpace = (e)=>{
            this._page.now--
        }
        this._list.onKeyDownSpace = (e)=>{
            this._page.now++
        }
        this._list.onKeyDownPgUp = (e)=>{
            this._page.now--
        }
        this._list.onKeyDownPgDn = (e)=>{
            this._page.now++
        }
        */
        this._el = this.#make()
    }
    get el() { return this._el }
    #make() { return van.tags.div(()=>this._list.el, ()=>this._page.el) }
    get list() {return this._list }
    get page() {return this._page }
    #show(){if(this.#in){this._list.selected.scrollIntoView()}}
    get #in() { // カーソルが表示領域内か
        const max = (this._page.now * this._list.row - 1)
        const min = max - this._list.row
        return min<=this._list.y && this._list.y<=max
    }
}
// li要素
class ListItem {
    constructor(options) {
        this._size = {
            height: van.state(24),
        }
        this._onMakeChild = this.#onMakeChild.bind(this)
        this.#loadOptions(options)
    }
    #loadOptions(options) {
        if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
    }
    get height( ) { return this._size.height.val }
    set height(v) { if(Number.isFinite(v) && 16<=v) { this._size.height.val = v; this.resize(); } }
    get onMakeChild( ) { return this._onMakeChild }
    set onMakeChild(v) { if('function'===typeof v) { this._onMakeChild = v } }
    //make(data,i) { return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;`}, this._onMakeChild(data,i)) }
    make(data,i) { return van.tags.li({style:this.#style.bind(this)}, this._onMakeChild(data,i)) }
    #style() {return `list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;` }
    #onMakeChild(data,i) { return document.createTextNode(data.toString()) }
}
class ListItemDatas {
    constructor(options) {
        this._datas = van.state([])
        this._onSetDatas = ()=>{}
    }
    get datas( ) { return this._datas }
    set datas(v) { if (Array.isArray(v)) { this._items = v; this._onSetDatas(this._datas); } } // this.el = make()
    get onSetDatas( ) { return this._onSetDatas }
    set onSetDatas(v) { if('function'===typeof v){this._onSetDatas=v} }

    get len() { return this._datas.length }
    get li() { return this.len-1 } // lastIndex
}
class ListItemDatasCursor {
    constructor(options) {
        this._datas = new ListItemDatas()
        this._i = 0
        this._onSetI = (i)=>{}
    }
    get datas( ) { return this._datas }
    get selected() { return this._datas.datas[this._i] }
    get i( ) { return this._i }
    set i(v) {
        if (Number.isInteger(v)) {
            if (v<0) {this._i=this._datas.li}
            else if (this._datas.len<=v) {this._i=0}
            else {this._i=v}
            this._onSetI(this._i)
        }
    }
    get onSetI( ) { return this._onSetI }
    set onSetI(v) { if('function'===typeof v){this._onSetI=v} }
}

// view,controll,model
// ListView, ListController, ListModel
// ListView(element), ListController(cursor,page,mouse,keybord), ListModel
//class ListStore {
class ListState {
    constructor(options) {
        //this._items = van.state([])
        //this._datas = new ListItemDatas()
        this._size = {
            height: van.state(24),
        }
        this._num = {
            row: van.state(7),
        }
        this._datas = van.state([])
        this._onSetItems = ()=>{}
        this._onSetRow = ()=>{}
    }
    get items( ) { return this._items }
    set items(v) { if (Array.isArray(v)) { this._items = v; this._onSetItems(this._items); } }
    get row( ) { return this._num.row.val }
    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row.val = v; this._onSetRow(this.row); } } // this.resize();
//    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row.val = v; this.resize(); } }
}
class List {
    constructor(options) {
        this._num = {
            row: van.state(7),
        }
        this._builder = new ListBuilder()
        this._pager = new ListPager()
        this._cursor = new ListCursor()
    }
    get row( ) { return this._num.row.val }
    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row.val = v; this.resize(); } }
}
class ListBuilder {
    constructor(options) {
        this._item = new ListItem()
        this._state = state // new ListState()
    }
    make() { return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._item.height*this._state.row}px;overflow-y:auto;`}, this.#makeLis()) }
    #makeLis() { return [...Array(this._state.row)].map((_,i)=>this._item.make(this._state.datas[i], i)) }
    remake() { // 頁遷移したときにli要素の内容を更新する
        this.#delEventLis()
        const items = this.#nowPageItems
        items.map((item,i)=>this.ol.children[i].replaceWith(this.#makeLi(item,i)))
        if (items.length < this.row) {
            const blankLen = this.row - items.length
            const blankIdxs = [...Array(blankLen)].map((_,i)=>this.row - blankLen + i)
            blankIdxs.map(idx=>this.ol.children[idx].style.display='none')
        }
        this.#addEventLis()

    }
}
class ListPager {
    constructor(options) {
        this._page = new Paginator()
    }
}
class ListCursor {
    constructor(options) {
        this._cur = new Cursor()
    }
    get y( ) { return this._y }
    set y(v) {
        if (Number.isInteger(v)) {
            if (v<0) {this._y=this.items.length-1}
            else if (this.items.length<=v) {this._y=0}
            else {this._y=v}

            // 頁遷移
            if (!this.#inPage) { this.#resetPageFromY() }
            // ハイライト
            this.#show()
        }
    }
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
    #make() { return van.tags.div({}, 
        van.tags.button({onclick:(e)=>--this.now}, '◀'),
        ()=>`${this.now}/${this.all}`,
        van.tags.button({onclick:(e)=>++this.now}, '▶'))
    }
}
class Cursor {
    constructor(options) {
        this._items = null
        this._y = 0
        this._onSetY = (y)=>{}
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
            this._onSetY(this._y)
        }
    }
    get onSetY( ) { return this._onSetY }
    set onSetY(v) { if('function'===typeof v){this._onSetY=v} }
}



// 項目: height, row, page, y
// 操作:
//   element(make,replace,highlight(classList.add/remove/contains),display=none/block), 
//   page(next/prev, first/last)
//   cursor(next/prev, first/last)
class FixList { // スクロールバーなし(列数固定。画面サイズ範囲内)
    constructor(options) {
        this._num = {
            row: van.state(7),
        }
        this._size = {
            height: van.state(24),
        }
        this._onShow = this.#onShow.bind(this) // 要素に表示するテキストを返す関数
        this._el = null
        this._items = van.state([])
        this._y = 0
        this._page = new Paginator()
        this._onWheel = (e)=>{}
        this._onWheelUp = (e)=>this.page.now--
        this._onWheelDown = (e)=>this.page.now++
        this._onWheelLeft = (e)=>{}
        this._onWheelRight = (e)=>{}
        this._onKeyDown = (e)=>{
                 if ('ArrowUp'===e.key) {this.y--;this.#show();}
            else if ('ArrowDown'===e.key) {this.y++;this.#show();}
            else if ('ArrowLeft'===e.key) {this.prevPage()}
            else if ('ArrowRight'===e.key) {this.nextPage()}
            else if (' '===e.key && e.shiftKey) {this.prevPage()}
            else if (' '===e.key) {this.nextPage()}
            else if ('PageUp'===e.key) {this.prevPage()}
            else if ('PageDown'===e.key) {this.nextPage()}
            else {}
        }
        if (Array.isArray(options)) {this.items.val=options}
        else if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
        this._page.all = Math.ceil(this.items.length / this.row)
        this._page.onSetNow = (now,all)=>{
            this.#updateLiChild()
        }
        this._page.onSetAll = (now,all)=>{

        }
    }
    resize() { // 窓サイズが変更されたら画面内に収まるようリストサイズや列数を減らす
        if(!this._el) { return }
        const h = this._size.height.val * this._num.row.val
        const ch = document.documentElement.clientHeight
        if (ch < h) {
            if (ch < this._size.height.val) {
                this._size.height.val = ch
                this._num.row.val = 1
            } else {
                this._num.row.val = Math.floor(ch / this._size.height.val)
            }
        }
        console.log(`resize: ch:${ch} h:${h} row:${this.row.val} height:${this.height.val}`)
    }
    get el() { return this._el }
    get ol() { return this._el.querySelector(`ol`) }
    get items( ) { return this._items.val }
    set items(v) { if (Array.isArray(v)) { this.#delEvent(); this._items.val=v; this._el=this.#make(); this.#addEvent(); } }
    get row( ) { return this._num.row.val }
    set row(v) { if(Number.isInteger(v) && 0<v) { this._num.row.val = v; this.resize(); } }
    get height( ) { return this._size.height.val }
    set height(v) { if(Number.isFinite(v) && 16<=v) { this._size.height.val = v; this.resize(); } }
    get y( ) { return this._y }
    set y(v) {
        if (Number.isInteger(v)) {
            if (v<0) {this._y=this.items.length-1}
            else if (this.items.length<=v) {this._y=0}
            else {this._y=v}

            // 頁遷移
            if (!this.#inPage) { this.#resetPageFromY() }
            // ハイライト
            this.#show()
        }
    }
    get page( ) { return this._page }
    nextPage() { // 末尾頁-1＆末尾頁の末尾項目に存在しないindexから頁遷移したとき、先頭頁へ遷移してしまうのを防ぐ。代わりに末尾頁の末尾項目へ遷移する。
        const i = this.y + this.row
        const l = this.items.length-1
        if (this.page.now===this.page.all) {this.y = i % this.row} // 先頭頁の同じy位置にある要素へ遷移する
        else {this.y = (l < i) ? this.items.length-1 : i}
    }
    prevPage() {
        if (1===this.page.now) { // 先頭頁から前に戻る（末尾頁へ遷移する）
            const i = (this.row * (this.page.all - 1)) + this.y
            const l = this.items.length-1
            this.y = (l < i) ? l : i // 末尾頁の同じy位置にある要素へ遷移する。なければ末尾項目へ。
        } else { this.y-=this.row }
    }
    get #inPage() { // カーソルが頁内か
        const min = ((this._page.now - 1) * this.row)
        const max = Math.min(min + this.row, this.items.length) - 1
        return min<=this.y && this.y<=max
    }
    #resetPageFromY() { this.page.now = Math.floor(this.y / this.row) + 1 } // カーソル位置に合わせて頁遷移する

    get #nowPageItemIdxs() { return [...Array(this.row)].map((_,i)=>i + (this.row * (this.page.now - 1))).filter(idx=>idx<this.items.length) }
    get #nowPageItems() { return this.#nowPageItemIdxs.map(idx=>this.items[idx]) }
    #updateLiChild() { // li要素の内容を更新する
        console.log(`#updateLiChild():`)
        console.log(this.#nowPageItemIdxs)
        this.#delEventLis()
        const items = this.#nowPageItems
        console.log(items)
        items.map((item,i)=>this.ol.children[i].replaceWith(this.#makeLi(item,i)))
        if (items.length < this.row) {
            const blankLen = this.row - items.length
            const blankIdxs = [...Array(blankLen)].map((_,i)=>this.row - blankLen + i)
            blankIdxs.map(idx=>this.ol.children[idx].style.display='none')
        }
        this.#addEventLis()
    }

    get onMakeLiChild( ) { return this._onMakeLiChild }
    set onMakeLiChild(v) { if('function'===typeof v) { this._onMakeLiChild = v } }
    get onWheel( ) { return this._onWheel }
    set onWheel(v) { if('function'===typeof v){this._onWheel=v} }
    get onWheelUp( ) { return this._onWheelUp }
    set onWheelUp(v) { if('function'===typeof v){this._onWheelUp=v} }
    get onWheelDown( ) { return this._onWheelDown }
    set onWheelDown(v) { if('function'===typeof v){this._onWheelDown=v} }
    get onWheelLeft( ) { return this._onWheelLeft }
    set onWheelLeft(v) { if('function'===typeof v){this._onWheelLeft=v} }
    get onWheelRight( ) { return this._onWheelRight }
    set onWheelRight(v) { if('function'===typeof v){this._onWheelRight=v} }
    get onKeyDown( ) { return this._onKeyDown }
    set onKeyDown(v) { if('function'===typeof v){this._onKeyDown=v} }
    get #selected() { return this.#lis.filter((li,i)=>i===this._y%this.row) }
    get selected() { return this.#selected[0] }
    get selectedIndex() { return this.#selected[1] }
    get #lis() { return [...this.ol.children] } // [...this.ol.querySelectorAll(`li`)]
    #show() {this.#clear(); this.selected.classList.add('selected');}
    #clear() {this.#lis.filter(li=>li.classList.contains('selected')).map(li=>li.classList.remove('selected'))}
    #onShow(data) { return data.toString() }

    #make() {return van.tags.div(()=>this.#makeOl(), ()=>this.page.el)}
    #makeOl() { return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height.val*this._num.row.val}px;overflow-y:auto;`}, this.#makeLis()) }
    #makeLis() { return [...Array(this.row)].map((_,i)=>this.#makeLi(this.items[i], i)) }
    #makeLi(data,i) { return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;`}, this._onMakeLiChild(data,i)) }
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
        this.ol.focus()
        this._y = [...e.target.parentElement.children].indexOf(e.target)
        console.log(`MouseEnter: y=${this._y}`)
        this.#show()
    }
    #onMouseLeave(e) {
        console.log(`MouseLeave:`, e)
        this.#clear()
    }
    #onWheel(e) {
        console.log(`Wheel:`, e)
        this.ol.focus()
        if (e.deltaY<0) { this.onWheelUp(e) }
        else if (0<e.deltaY) { this.onWheelDown(e) }
        else if (e.deltaX<0) { this.onWheelLeft(e) }
        else if (0<e.deltaX) { this.onWheelRight(e) }
        e.preventDefault()
    }
    #onMouseUp(e) {
        console.log(`MouseUp:`, e)
        this.ol.focus()
             if (0===e.button) {console.log(`マウス左ボタン押下`)}
        else if (1===e.button) {console.log(`マウス中ボタン押下`)}
        else if (2===e.button) {console.log(`マウス右ボタン押下`)}
        else if (3===e.button) {console.log(`マウス戻るボタン押下`)}
        else if (4===e.button) {console.log(`マウス進むボタン押下`)}
        else {console.log(`不明なマウスボタンを押下した。`)}
    }
    #onKeyDown(e) {
        console.log(`keydown: ${e.key}`)
        if (event.isComposing || event.keyCode === 229) {return} // IME変換中操作を無視する
        else {this.onKeyDown(e)}
        e.preventDefault()
    }
    #addEventLis() {
        this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    #delEventLis() {
        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    #addEvent() {
        if (!this.ol) {return}
        this.#addEventLis()
        this.ol.addEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.addEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.addEventListener('keydown', this.#onKeyDown.bind(this))
    }
    #delEvent() {
        if (!this.el) {return}
        this.#delEventLis()
        this.ol.removeEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.removeEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.removeEventListener('keydown', this.#onKeyDown.bind(this))
    }
}
/*
class List { // スクロールバーあり
    constructor(options) {
        this._num = {row:7} // 要素数
        this._size = {height:24} // 要素の高さ
        this._onShow = this.#onShow.bind(this) // 要素に表示するテキストを返す関数
        this._el = null
        this._items = van.state([])
        this._y = 0
        this._onWheelUp = (e)=>{}
        this._onWheelDown = (e)=>{}
        this._onWheelLeft = (e)=>{}
        this._onWheelRight = (e)=>{}
        this._onKeyDown = (e)=>{}
        this._onKeyDownlUp = (e)=>{}
        this._onKeyDownDown = (e)=>{}
        this._onKeyDownLeft = (e)=>{}
        this._onKeyDownRight = (e)=>{}
        this._onKeyDownSpace = (e)=>{}
        this._onKeyDownShiftSpace = (e)=>{}
        this._onKeyDownPgUp = (e)=>{}
        this._onKeyDownPgDn = (e)=>{}
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
    get y( ) { return this._y }
    set y(v) {
        if (Number.isInteger(v)) {
            if (v<0) {this._y=this._items.length-1}
            else if (this._items.length<=v) {this._y=0}
            else {this._y=v}
            this.#show()
        }
    }
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
    get onKeyDown( ) { return this._onKeyDown }
    set onKeyDown(v) { if('function'===typeof v){this._onKeyDown=v} }
    get selected() { return this.#lis.filter((li,i)=>i===this._y)[0] }
    get selectedIndex() { return this.#lis.filter((li,i)=>i===this._y)[1] }
    #show() {this.#clear(); this.selected.classList.add('selected');}
    #clear() {this.#lis.filter(li=>li.classList.contains('selected')).map(li=>li.classList.remove('selected'))}
    #onShow(data) { return data.toString() }
    //#make(){return van.tags.ol({style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:auto;`}, this._items.val.map((v,i)=>van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(v))))}
    #make(){return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:auto;`}, this._items.val.map((v,i)=>van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(v))))}
    get #lis() { return [...this.el.children] } // [...this.el.querySelectorAll(`li`)]
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
        this.el.focus()
        this._y = [...e.target.parentElement.children].indexOf(e.target)
        console.log(`MouseEnter: y=${this._y}`)
        this.#show()
    }
    #onMouseLeave(e) {
        console.log(`MouseLeave:`, e)
        this.#clear()
    }
    #onWheel(e) {
        console.log(`Wheel:`, e)
        this.el.focus()
        if (e.deltaY<0) { this.onWheelUp(e) }
        else if (0<e.deltaY) { this.onWheelDown(e) }
        else if (e.deltaX<0) { this.onWheelLeft(e) }
        else if (0<e.deltaX) { this.onWheelRight(e) }
        e.preventDefault()
    }
    #onMouseUp(e) {
        console.log(`MouseUp:`, e)
        this.el.focus()
             if (0===e.button) {console.log(`マウス左ボタン押下`)}
        else if (1===e.button) {console.log(`マウス中ボタン押下`)}
        else if (2===e.button) {console.log(`マウス右ボタン押下`)}
        else if (3===e.button) {console.log(`マウス戻るボタン押下`)}
        else if (4===e.button) {console.log(`マウス進むボタン押下`)}
        else {console.log(`不明なマウスボタンを押下した。`)}
    }
    #onKeyDown(e) {
        console.log(`keydown: ${e.key}`)
        if (event.isComposing || event.keyCode === 229) {return} // IME変換中操作を無視する
        else {this.onKeyDown(e)}
        e.preventDefault()
    }
    #addEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
        this.el.addEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.el.addEventListener('mouseup', this.#onMouseUp.bind(this))
        this.el.addEventListener('keydown', this.#onKeyDown.bind(this))
//        this.#lis.map(li=>li.addEventListener('keydown', this.#onKeyDown.bind(this)))
    }
    #delEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
        this.el.removeEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.el.removeEventListener('mouseup', this.#onMouseUp.bind(this))
        this.el.removeEventListener('keydown', this.#onKeyDown.bind(this))
//        this.#lis.map(li=>li.removeEventListener('keydown', this.#onKeyDown.bind(this)))
    }
}
*/
window.Pager = Pager
window.List = List
window.FixList = FixList
})();
