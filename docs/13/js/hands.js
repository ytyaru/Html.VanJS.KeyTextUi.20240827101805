;(function(){
class Hands {
    constructor(lHands,rHands) {
        this._hands = [lHands,rHands]
        this._cur = new Cursor(this._hands)
        this._ui = new ListUi(this._cur)
    }
    init() {this._ui.init()}
    get hands() { return this._hands }
    set hands(v) {
        this._hands = v
        this._cur.hands = this._hands
        this._ui.hands = this._hands
    }
}
class Cursor {
    constructor(hands) {
        this._focus = false
        this._x = 0
        this._y = [0, 0]
        this._hands = hands
    }
    get x() { return this._x }
    get y() { return this._y[this._x] }
    get lastY() { return this._hands[this._x].length-1 }
    set x(v) {
        if (v<0) { this._x = 1 }
        else if (1<v) { this._x = 0 }
        else { this._x = v }
    }
    set y(v) {
        const o = this._y[this._x]
        if (v<0) { this._y[this._x] = 0 }
        else if (this._hands[this._x].length-1<v) { this._y[this._x] = this._hands[this._x].length-1 }
        else { this._y[this._x] = v }
    }
    get xid() { return 0===this._x ? 'left' : 'right' }
    set xid(v) { this._x = 'left'===v ? 0 : 1 }
    get xzip() { return [['left',0],['right',1]] }
    get len() { return this._hands[this._x].length }
    get selected() { return this._hands[this._x][this._y] }
    get hand() { return this._hands[this._x] }
    set hand(v) { this._hands[this._x] = v }
    get hands() { return this._hands }
    set hands(v) { this._hands = v }
    log() { console.debug(`cursor:${this._x},${this._y}`) }
}
class ListUi {
    constructor(cur) {
        this._cur = cur
//        this._id = 'hands'
//        this._el = null
//        this._num = {height:7}
//        this._size = {height:16}
        //this._size.height = document.querySelector(`ol[name="${this._id}"] li`).offsetHeight
        this._uis = this._cur.xzip.map(([id,i])=>new HandUi(id, this._cur.hands[i]))
    }
    //init() {this.#addEl(); this.#addEvents();}
    init() {this._uis.map(ui=>ui.init())}
    get hands() { return this._cur.hands }
    set hands(v) {
        if (Array.isArray(v) && 2===v.length && v.every(i=>Array.isArray(i))) {
            this._cur.hands = v
            this._uis.map((ui,i)=>ui.hand=v[i])
//            this.#remake()
            this.show()
        }
        return this._hands
    }
    /*
    #addEl() {
        this._cur.xzip.map(([id,i])=>van.add(document.querySelector(`#${id} div[name=hands]`), this.#make(this._cur.hands[i])))
        document.querySelector(`div[name=hands] li`).classList.toggle('selected');
        this._size.height = document.querySelector(`div[name=hands] li`).offsetHeight
    }
    #make(hands){return van.tags.ol({name:`hands`, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #remake() {
        this._cur.xzip.map(([id,i])=>document.querySelector(`#${id} div[name=hands] ol`).replaceWith(this.#make(this._cur.hands[i])))
    }
    */
    get #lefts() { return [...document.querySelectorAll(`#left ol[name=hands] li`)] }
    get #rights() { return [...document.querySelectorAll(`#right ol[name=hands] li`)] }
    get selected() { return (0===this._cur.x ? this.#lefts : this.#rights).filter((li,i)=>i===this._cur.y)[0] }
    show() {this.clear(); const selected=this.selected; selected.classList.add('selected'); selected.scrollIntoView();}
    clear() {[...document.querySelectorAll(`ol[name=hands] li`)].map(li=>li.classList.remove('selected'));}
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            const y = this._cur.y
            if ('ArrowUp'===e.key) {this._cur.y = 0===y ? this._cur.len-1 : y-1; this.show(); e.preventDefault();}
            else if ('ArrowDown'===e.key) {this._cur.y = this._cur.len-1===y ? 0 : y+1; this.show(); e.preventDefault(); }
            else if ('ArrowLeft'===e.key){this._cur.x = 0===this._cur.x ? 1 : 0; this.show(); e.preventDefault();}
            else if ('ArrowRight'===e.key){this._cur.x = 1===this._cur.x ? 0 : 1; this.show(); e.preventDefault();}
        })
        /*
        window.addEventListener('mouseenter', async(e)=>{
            console.log('mouseenter: window')
            const selected = e.target
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                if (!['left','right'].some(v=>v===dirId)) {return}
                this._cur.xid = dirId
                this._cur.y = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                this.show()
            }
        })
        */
        window.addEventListener('click', async(e)=>{
            const selected = e.target
            console.log(selected?.parentElement?.tagName?.toLowerCase(), this._id===selected.parentElement.name, selected.parentElement.name, selected.parentElement.getAttribute('name'))
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                [...document.querySelectorAll(`ol[name="hands"] li`)].map(li=>li.classList.remove('selected'));
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                console.log([...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)])
                this._cur.xid = dirId
                this._cur.y = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                this.show()
            }
        })
        /*
        window.addEventListener('wheel', (e)=>{
            console.log('wheel:', e.target, e)
            const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
            console.log(dirId)
            console.log(e.target)
            console.log(e.target.parentElement.parentElement.parentElement)
            if (['left','right'].some(id=>id===dirId)) {
                this._cur.xid = dirId
                const firstLi = document.querySelector(`#${dirId} ol[name="hands"] li:first-child`)
                const lastLi = document.querySelector(`#${dirId} ol[name="hands"] li:last-child`)
                const selected = document.querySelector(`#${dirId} ol[name="hands"] li:nth-child(${this._cur.y+1})`)
                console.log(firstLi, lastLi, selected, this._cur, this._cur.x, this._cur.hands[this._cur.x][this._cur.y[this._cur.x]]+1)
                // 横
                if (0<e.deltaX) {this._cur.x = (1===this._cur.x ? 0 : 1)} // 右端から更に右へ行こうとしたとき左端へ移動する
                if (e.deltaX>0) {this._cur.x = (0===this._cur.x ? 1 : 0)} // 左端から更に左へ行こうとしたとき右端へ移動する
                // 縦
                if (0<e.deltaY) {
                    if (lastLi===selected) { // 末尾から更に下へ行こうとしたとき最上へ
                        this._cur.y=0
                        e.target.parentElement.scrollTo(0,0)
                        console.log('0<e.deltaY if:', this._cur)
                    } else {
                        this._cur.y++
                        if (this._cur.len-1<this._cur.y) { this._cur.y=this._cur.len-1 }
                        e.target.parentElement.scrollBy(0,this._size.height)
                        console.log('0<e.deltaY else:', this._cur)
                    }
                }
                if (e.deltaY<0) {
                    if (firstLi===selected) { // 先頭から更に上へ行こうとしたとき最下へ
                        this._cur.y=this._cur.len-1
                        e.target.parentElement.scrollTo(0,this._cur.y*this._size.height)
                        console.log('if:', this._cur)
                    } else {
                        this._cur.y--
                        if (this._cur.y<0) { this._cur.y=0 }
                        e.target.parentElement.scrollBy(0,-this._size.height)
                        console.log('else:', this._cur)
                    }
                }
                this.show()
                e.preventDefault();
            }
        }, {passive:false})
        */
    }
}
class HandUi {
    constructor(id, hand) {
        this._id = id
        this._hand = hand
        this._name = 'hands'
        this._num = {height:7}
        this._size = {height:16}
        //this._size.height = document.querySelector(`ol[name="${this._id}"] li`).offsetHeight
        this._scroll = {isTop:false, isBottom:false}
        this._y = 0
    }
    init() {this.#addEl(); this.#addEvents();}
    get el() { return document.querySelector(`#${this._id} ol`) }
    get hand() { return this._.hand }
    set hand(v) {
        if (Array.isArray(v)) {
            this._hand = v
            this.#removeEvents()
            this.#remake()
            this.#addEvents()
//            this.show()
        }
    }
    get isTop() {return this._scroll.isTop}
    get isBottom() {return this._scroll.isBottom}
    get y() { return this._y }
    set y(v) { if (Number.isInteger(v) && 0<=v && v<this._hand.length){this._y = v} }
    #addEl() {
        van.add(document.querySelector(`#${this._id} div[name=hands]`), this.#make())
//        this._cur.xzip.map(([id,i])=>van.add(document.querySelector(`#${id} div[name=hands]`), this.#make(this._cur.hands[i])))
//        document.querySelector(`div[name=hands] li`).classList.toggle('selected');
        this._size.height = document.querySelector(`div[name=hands] li`).offsetHeight
    }
    #make(){return van.tags.ol({name:`hands`, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, this._hand.map((v,i)=>van.tags.li(v)))}
    #remake() {document.querySelector(`#${this._id} div[name=hands] ol`).replaceWith(this.#make())}

    get #lis() { return [...document.querySelectorAll(`#${this._id} ol li`)]  }
    #onMouseEnter(e) {
//        const selected = e.target
//        const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
//        if (!['left','right'].some(v=>v===dirId)) {return}
//        this._cur.xid = dirId
//        this._cur.y = lis.map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
        const selected = e.target
        console.log(`mouseenter: ${selected}`)
        this._y = this.#lis.map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
        console.log(`${this._id}:${this._y}`)
        this.show()
    }
    #onWheel(e) {
        const ol = e.target
        console.log(`wheel: ${ol}`)
        console.log(e)
    }
    #onScroll(e) {
        const ol = e.target
        console.log(`scroll: ${ol}`)
        // ios系はバウンドするので <= としている
        this._scroll.isBottom = ol.scrollHeight - ol.scrollTop <= ol.clientHeight
        this._scroll.isTop = 0===ol.scrollTop
    }
    #removeEvents() {
//        this.el.removeEventListener('scroll', this.#onScroll.bind(this))
        for (let li of this.#lis) {li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this))}
        this.el.removeEventListener('wheel', this.#onWheel.bind(this, {passive:false}))
    }
    #addEvents() {
//        this.el.addEventListener('scroll', this.#onScroll.bind(this))
        for (let li of this.#lis) {li.addEventListener('mouseenter', this.#onMouseEnter.bind(this))}
        this.el.addEventListener('wheel', this.#onWheel.bind(this, {passive:false}))
    }
    //get selected() { return (0===this._cur.x ? this.#lefts : this.#rights).filter((li,i)=>i===this._cur.y)[0] }
    get selected() { return this.#lis.filter((li,i)=>i===this._y)[0] }
    show() {this.clear(); const selected=this.selected; selected.classList.add('selected'); selected.scrollIntoView();}
    clear() {[...document.querySelectorAll(`ol[name=hands] li`)].map(li=>li.classList.remove('selected'));}
}/*
class ListUi {
    constructor(cur) {
        this._cur = cur
        this._id = 'hands'
        this._el = null
        this._num = {height:7}
        this._size = {height:16}
        //this._size.height = document.querySelector(`ol[name="${this._id}"] li`).offsetHeight
    }
    init() {this.#addEl(); this.#addEvents();}
    get hands() { return this._cur.hands }
    set hands(v) {
        if (Array.isArray(v) && 2===v.length && v.every(i=>Array.isArray(i))) {
            this._cur.hands = v
            this.#remake()
            this.show()
        }
        return this._hands
    }
    #addEl() {
        this._cur.xzip.map(([id,i])=>van.add(document.querySelector(`#${id} div[name=hands]`), this.#make(this._cur.hands[i])))
        document.querySelector(`div[name=hands] li`).classList.toggle('selected');
        this._size.height = document.querySelector(`div[name=hands] li`).offsetHeight
    }
    #make(hands){return van.tags.ol({name:`hands`, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #remake() {
        this._cur.xzip.map(([id,i])=>document.querySelector(`#${id} div[name=hands] ol`).replaceWith(this.#make(this._cur.hands[i])))
    }
    get #lefts() { return [...document.querySelectorAll(`#left ol[name=hands] li`)] }
    get #rights() { return [...document.querySelectorAll(`#right ol[name=hands] li`)] }
    get selected() { return (0===this._cur.x ? this.#lefts : this.#rights).filter((li,i)=>i===this._cur.y)[0] }
    show() {this.clear(); const selected=this.selected; selected.classList.add('selected'); selected.scrollIntoView();}
    clear() {[...document.querySelectorAll(`ol[name=hands] li`)].map(li=>li.classList.remove('selected'));}
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            const y = this._cur.y
            if ('ArrowUp'===e.key) {this._cur.y = 0===y ? this._cur.len-1 : y-1; this.show(); e.preventDefault();}
            else if ('ArrowDown'===e.key) {this._cur.y = this._cur.len-1===y ? 0 : y+1; this.show(); e.preventDefault(); }
            else if ('ArrowLeft'===e.key){this._cur.x = 0===this._cur.x ? 1 : 0; this.show(); e.preventDefault();}
            else if ('ArrowRight'===e.key){this._cur.x = 1===this._cur.x ? 0 : 1; this.show(); e.preventDefault();}
        })
        window.addEventListener('mouseenter', async(e)=>{
            console.log('mouseenter: window')
            const selected = e.target
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                if (!['left','right'].some(v=>v===dirId)) {return}
                this._cur.xid = dirId
                this._cur.y = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                this.show()
            }
        })
        window.addEventListener('click', async(e)=>{
            const selected = e.target
            console.log(selected?.parentElement?.tagName?.toLowerCase(), this._id===selected.parentElement.name, selected.parentElement.name, selected.parentElement.getAttribute('name'))
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                [...document.querySelectorAll(`ol[name="hands"] li`)].map(li=>li.classList.remove('selected'));
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                console.log([...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)])
                this._cur.xid = dirId
                this._cur.y = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                this.show()
            }
        })
        window.addEventListener('wheel', (e)=>{
            console.log('wheel:', e.target, e)
            const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
            console.log(dirId)
            console.log(e.target)
            console.log(e.target.parentElement.parentElement.parentElement)
            if (['left','right'].some(id=>id===dirId)) {
                this._cur.xid = dirId
                const firstLi = document.querySelector(`#${dirId} ol[name="hands"] li:first-child`)
                const lastLi = document.querySelector(`#${dirId} ol[name="hands"] li:last-child`)
                const selected = document.querySelector(`#${dirId} ol[name="hands"] li:nth-child(${this._cur.y+1})`)
                console.log(firstLi, lastLi, selected, this._cur, this._cur.x, this._cur.hands[this._cur.x][this._cur.y[this._cur.x]]+1)
                // 横
                if (0<e.deltaX) {this._cur.x = (1===this._cur.x ? 0 : 1)} // 右端から更に右へ行こうとしたとき左端へ移動する
                if (e.deltaX>0) {this._cur.x = (0===this._cur.x ? 1 : 0)} // 左端から更に左へ行こうとしたとき右端へ移動する
                // 縦
                if (0<e.deltaY) {
                    if (lastLi===selected) { // 末尾から更に下へ行こうとしたとき最上へ
                        this._cur.y=0
                        e.target.parentElement.scrollTo(0,0)
                        console.log('0<e.deltaY if:', this._cur)
                    } else {
                        this._cur.y++
                        if (this._cur.len-1<this._cur.y) { this._cur.y=this._cur.len-1 }
                        e.target.parentElement.scrollBy(0,this._size.height)
                        console.log('0<e.deltaY else:', this._cur)
                    }
                }
                if (e.deltaY<0) {
                    if (firstLi===selected) { // 先頭から更に上へ行こうとしたとき最下へ
                        this._cur.y=this._cur.len-1
                        e.target.parentElement.scrollTo(0,this._cur.y*this._size.height)
                        console.log('if:', this._cur)
                    } else {
                        this._cur.y--
                        if (this._cur.y<0) { this._cur.y=0 }
                        e.target.parentElement.scrollBy(0,-this._size.height)
                        console.log('else:', this._cur)
                    }
                }
                this.show()
                e.preventDefault();
            }
        }, {passive:false})

        for (let id of ['left','right']) {
            const el = document.querySelector(`#${id} ol[name="hands"]`)
            el.addEventListener('scroll', () => {
                console.log('scroll')
                // ios系はバウンドするので <= としている
                el.scrollHeight - element.scrollTop <= element.clientHeight
            });
            el.addEventListener('mouseenter', async(e)=>{
                console.log('mouseenter')
                const selected = e.target
                if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                    const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                    if (!['left','right'].some(v=>v===dirId)) {return}
                    this._cur.xid = dirId
                    this._cur.y = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                    this.show()
                }
            })
            el.addEventListener('mouseenter', async(e)=>{
                console.log('mouseenter')
            }
        }
    }
}
*/

//window.Hands = new Hands([])
//window.Hands = new Hands([''])
//window.Hands = new Hands(['A'])
window.Hands = new Hands(['A','B','C'], ['X','Y','Z'])
})();
