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
class FixList { // スクロールバーなし(列数固定。画面サイズ範囲内)
    constructor(options) {
        this._num = {
            row: van.state(7),
        }
        this._size = {
            height: van.state(24),
        }
//        this._num = {row:7} // 要素数
//        this._size = {height:24} // 要素の高さ
        this._onShow = this.#onShow.bind(this) // 要素に表示するテキストを返す関数
        this._el = null
        this._items = van.state([])
        this._y = 0
        this._page = new Paginator()
        this._onWheel = (e)=>{}
        this._onWheelUp = (e)=>this.page.now--
        this._onWheelDown = (e)=>this.page.now++
//        this._onWheelUp = (e)=>{this.page.now--;this.#updateLiChild();}
//        this._onWheelDown = (e)=>{this.page.now++;this.#updateLiChild();}
        this._onWheelLeft = (e)=>{}
        this._onWheelRight = (e)=>{}
        this._onKeyDown = (e)=>{}
        if (Array.isArray(options)) {this.items.val=options}
        else if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
        this._page.all = Math.ceil(this.items.length / this.row)
        this._page.onSetNow = (now,all)=>{
            //this._list.el.children[this._list.row*(now-1)].scrollIntoView()
            this.#updateLiChild()
        }
        this._page.onSetAll = (now,all)=>{

        }
    }
    resize() { // 窓サイズが変更されたら画面内に収まるようリストサイズや列数を減らす
        if(!this._el) { return }
        //const h = this._el.getBoundingClientRect().height
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
    //set height(v) { if(Number.isFinite(v) && 0<v) { this._size.height = v } }
    set height(v) { if(Number.isFinite(v) && 16<=v) { this._size.height.val = v; this.resize(); } }
    get y( ) { return this._y }
    set y(v) {
        if (Number.isInteger(v)) {
            if (v<0) {this._y=this._items.length-1}
            else if (this._items.length<=v) {this._y=0}
            else {this._y=v}
            this.#show()
        }
    }
    get page( ) { return this._page }
    /*
    set page(v) {
        if (0<v && v<=Math.ceil(this.items.length/this.row)) {
            this._page = v
            this.#updateLiChild()
        }    
    }
    */
    get #nowPageItemIdxs() { return [...Array(this.row)].map((_,i)=>i + (this.row * (this.page.now - 1))).filter(idx=>idx<this.items.length) }
    get #nowPageItems() { return this.#nowPageItemIdxs.map(idx=>this.items[idx]) }
    #updateLiChild() { // li要素の内容を更新する
        console.log(`#updateLiChild():`)
        console.log(this.#nowPageItemIdxs)
        const items = this.#nowPageItems
        console.log(items)
//        items.map((item,i)=>this.el.children[i].replaceWith(this.#makeLi(item,i)))
        items.map((item,i)=>{
            this.ol.children[i].replaceWith(this.#makeLi(item,i))
            /*
//            this.el.children[i].style.display = 'block'
//            this.el.children[i].replaceChild(this._onMakeLiChild(item,i))
            this.ol.children[i].style.display = 'block'
            //this.ol.children[i].replaceChild(this._onMakeLiChild(item,i))
            console.log(this._onMakeLiChild(item,i))
            console.log(this.ol.children[i])
            console.log(this.ol.children[i].children)
            console.log(this.ol.children[i].children[0])
            this.ol.children[i].replaceChild(this._onMakeLiChild(item,i), this.ol.children[i].children[0])
            */
        })
        if (items.length < this.row) {
            const blankLen = this.row - items.length
//            const blankIdxs = [...Array(this.row)].map((_,i)=>i + items.length)
            //const blankIdxs = [...Array(blankLen)].map((_,i)=>i + blankLen)
            //const blankIdxs = [...Array(blankLen)].map((_,i)=>this.row - (i + blankLen))
            const blankIdxs = [...Array(blankLen)].map((_,i)=>this.row - blankLen + i)
            //blankIdxs.map(idx=>this.el.children[idx].style.display='none')
            console.log(blankLen, blankIdxs)
            blankIdxs.map(idx=>this.ol.children[idx].style.display='none')
        }
    }

//    get onShow( ) { return this._onShow }
//    set onShow(v) { if('function'===typeof v) { this._onShow = v } }
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
    get #selected() { return this.#lis.filter((li,i)=>i===this._y) }
    get selected() { return this.#selected[0] }
    get selectedIndex() { return this.#selected[1] }
    //get #lis() { return [...this.el.children] } // [...this.el.querySelectorAll(`li`)]
    get #lis() { return [...this.ol.children] } // [...this.ol.querySelectorAll(`li`)]
    #show() {this.#clear(); this.selected.classList.add('selected');}
    #clear() {this.#lis.filter(li=>li.classList.contains('selected')).map(li=>li.classList.remove('selected'))}
    #onShow(data) { return data.toString() }

    #make() {return van.tags.div(()=>this.#makeOl(), ()=>this.page.el)}
    //#makeOl() { return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height.val*this._num.row.val}px;overflow-y:auto;`}, ()=>this.#makeLis()) }
    #makeOl() { return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height.val*this._num.row.val}px;overflow-y:auto;`}, this.#makeLis()) }
    #makeLis() { return [...Array(this.row)].map((_,i)=>this.#makeLi(this.items[i], i)) }
    #makeLi(data,i) { return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;`}, this._onMakeLiChild(data,i)) }
//    #make(){return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:auto;`}, this._items.val.map((v,i)=>this.#makeLi(v,i))}
//    #make(){return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._size.height*this._num.row}px;overflow-y:auto;`}, this._items.val.map((v,i)=>this.#makeLi(v,i))}
//    #makeLi(v,i) {return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;`}, this._onShow(v)))}
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
        //this.el.focus()
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
        //this.el.focus()
        this.ol.focus()
        if (e.deltaY<0) { this.onWheelUp(e) }
        else if (0<e.deltaY) { this.onWheelDown(e) }
        else if (e.deltaX<0) { this.onWheelLeft(e) }
        else if (0<e.deltaX) { this.onWheelRight(e) }
        e.preventDefault()
    }
    #onMouseUp(e) {
        console.log(`MouseUp:`, e)
        //this.el.focus()
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
        /*
        else if ('ArrowUp'===e.key) {this._onKeyDownlUp(e)}
        else if ('ArrowDown'===e.key) {this._onKeyDownDown(e)}
        else if ('ArrowLeft'===e.key) {this._onKeyDownLeft(e)}
        else if ('ArrowRight'===e.key) {this._onKeyDownRight(e)}
        else if (' '===e.key && e.shiftKey) {this._onKeyDownShiftSpace(e)}
        else if (' '===e.key) {this._onKeyDownSpace(e)}
        else if ('PageUp'===e.key) {this._onKeyDownPgUp(e)}
        else if ('PageDown'===e.key) {this._onKeyDownPgUp(e)}
        else {this._onKeyDownAthor(e)}
        e.preventDefault()
        */
    }
    #addEvent() {
        //if (!this.el) {return}
        if (!this.ol) {return}
        this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
//        this.el.addEventListener('wheel', this.#onWheel.bind(this), {passive:false})
//        this.el.addEventListener('mouseup', this.#onMouseUp.bind(this))
//        this.el.addEventListener('keydown', this.#onKeyDown.bind(this))
        this.ol.addEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.addEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.addEventListener('keydown', this.#onKeyDown.bind(this))
//        this.#lis.map(li=>li.addEventListener('keydown', this.#onKeyDown.bind(this)))
    }
    #delEvent() {
        if (!this.el) {return}
        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
//        this.el.removeEventListener('wheel', this.#onWheel.bind(this), {passive:false})
//        this.el.removeEventListener('mouseup', this.#onMouseUp.bind(this))
//        this.el.removeEventListener('keydown', this.#onKeyDown.bind(this))
        this.ol.removeEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.removeEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.removeEventListener('keydown', this.#onKeyDown.bind(this))
//        this.#lis.map(li=>li.removeEventListener('keydown', this.#onKeyDown.bind(this)))
    }
}
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
        /*
        else if ('ArrowUp'===e.key) {this._onKeyDownlUp(e)}
        else if ('ArrowDown'===e.key) {this._onKeyDownDown(e)}
        else if ('ArrowLeft'===e.key) {this._onKeyDownLeft(e)}
        else if ('ArrowRight'===e.key) {this._onKeyDownRight(e)}
        else if (' '===e.key && e.shiftKey) {this._onKeyDownShiftSpace(e)}
        else if (' '===e.key) {this._onKeyDownSpace(e)}
        else if ('PageUp'===e.key) {this._onKeyDownPgUp(e)}
        else if ('PageDown'===e.key) {this._onKeyDownPgUp(e)}
        else {this._onKeyDownAthor(e)}
        e.preventDefault()
        */
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
window.Pager = Pager
window.List = List
window.FixList = FixList
})();
