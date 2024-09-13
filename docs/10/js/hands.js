;(function(){
class Hands {
    constructor(lHands,rHands) {
        this._hands = [lHands,rHands]
        this._cur = new Cursor(this._hands)
        //this._ui = new ListUi(this._hands)
        this._ui = new ListUi(this._cur)
//        this._id = 'hands'
//        this._hands = [lHands,rHands]
//        this._cur = {x:0,y:[0,0]}
//        this._size = {height:16}
//        this._num = {height:7}
    }
    //init() {this.#addEl(); this.#addEvents();}
    init() {this._ui.init()}
    get hands() { return this._hands }
    set hands(v) {
        this._hands = v
        this._cur.hands = this._hands
        this._ui.hands = this._hands
//        document.querySelector(`#left div[name=hands] ol`).replaceWith(this.#make(v[0]))
//        document.querySelector(`#right div[name=hands] ol`).replaceWith(this.#make(v[1]))
//        this.#showCursor()
    }
    #addEl() {
        console.log(this._hands)
        van.add(document.querySelector(`#left div[name=hands]`), this.#make(this._hands[0]))
        van.add(document.querySelector(`#right div[name=hands]`), this.#make(this._hands[1]))
        document.querySelector(`div[name="${this._id}"] li`).classList.toggle('selected');
        this._size.height = document.querySelector(`div[name="${this._id}"] li`).offsetHeight
    }
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            const y = this._cur.y[this._cur.x]
            if ('ArrowUp'===e.key) {
                this._cur.y[this._cur.x] = 0===y ? this._hands[this._cur.x].length-1 : y-1; this.#showCursor(0,-1); console.log(y); e.preventDefault();}
            else if ('ArrowDown'===e.key) { this._cur.y[this._cur.x] = this._hands[this._cur.x].length-1===y ? 0 : y+1; this.#showCursor(0,+1); console.log(y); e.preventDefault(); }
            else if ('ArrowLeft'===e.key){this._cur.x = 0===this._cur.x ? this._hands.length-1 : this._cur.x-1; this.#showCursor(-1,0); console.log(this._cur.x);e.preventDefault();}
            else if ('ArrowRight'===e.key){this._cur.x = this._hands.length-1===this._cur.x ? 0 : this._cur.x+1; this.#showCursor(+1,0); console.log(this._cur.y); e.preventDefault();}
        })
        window.addEventListener('click', async(e)=>{
            const selected = e.target
            console.log(selected?.parentElement?.tagName?.toLowerCase(), this._id===selected.parentElement.name, selected.parentElement.name, selected.parentElement.getAttribute('name'))
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                [...document.querySelectorAll(`ol[name="hands"] li`)].map(li=>li.classList.remove('selected'));
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                console.log([...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)])
                this._cur.x = 'left'===dirId ? 0 : 1
                this._cur.y[this._cur.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                //this._cur.y[this._cur.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].filter((li,i)=>li===selected)
                selected.classList.add('selected')
//                selected.scrollIntoView()
            }
        })

        window.addEventListener('wheel', (e)=>{
            console.log('wheel:', e.target, e)
            const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
            console.log(dirId)
            console.log(e.target)
            console.log(e.target.parentElement.parentElement.parentElement)
            if (['left','right'].some(id=>id===dirId)) {
                this._cur.x = 'left'===dirId ? 0 : 1
                const firstLi = document.querySelector(`#${dirId} ol[name="hands"] li:first-child`)
                const lastLi = document.querySelector(`#${dirId} ol[name="hands"] li:last-child`)
                const selected = document.querySelector(`#${dirId} ol[name="hands"] li:nth-child(${this._cur.y[this._cur.x]+1})`)
                console.log(firstLi, lastLi, selected, this._cur, this._cur.x, this._hands[this._cur.x][this._cur.y[this._cur.x]]+1)
                // 横
                if (0<e.deltaX || e.deltaX>0) {this._cur.x = ('left'===dirId ? 1 : 0)}
                // 縦
                if (0<e.deltaY) {
                    if (lastLi===selected) { // 末尾から更に下へ行こうとしたとき最上へ
                        this._cur.y[this._cur.x]=0
                        e.target.parentElement.scrollTo(0,0)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,0)
                        console.log('0<e.deltaY if:', this._cur)
                    } else {
                        this._cur.y[this._cur.x]++
                        if (this._hands[this._cur.x].length-1<this._cur.y[this._cur.x]) { this._cur.y[this._cur.x]=this._hands[this._cur.x].length-1 }
                        e.target.parentElement.scrollBy(0,this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,this._size.height)
                        console.log('0<e.deltaY else:', this._cur)
                    }
                }
                if (e.deltaY<0) {
                    if (firstLi===selected) { // 先頭から更に上へ行こうとしたとき最下へ
                        this._cur.y[this._cur.x]=this._hands[this._cur.x].length-1
                        e.target.parentElement.scrollTo(0,this._cur.y[this._cur.x]*this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,this._cur.y[this._cur.x]*this._size.height)
                        console.log('if:', this._cur)
                    } else {
                        this._cur.y[this._cur.x]--
                        if (this._cur.y[this._cur.x]<0) { this._cur.y[this._cur.x]=0 }
                        e.target.parentElement.scrollBy(0,-this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,-this._size.height)
                        console.log('else:', this._cur)
                    }
                }
                this.#showCursor()
                e.preventDefault();
            }
        }, {passive:false})
    }
    #make(hands){return van.tags.ol({name:this._id, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #showCursor(dirX, dirY) {
        const lefts = [...document.querySelectorAll(`#left div[name=hands] li`)]
        const rights = [...document.querySelectorAll(`#right div[name=hands] li`)]
        const lis = [...lefts, ...rights]
        lis.map(li=>li.classList.remove('selected'));
        console.log(this._cur)
        const selected = (0===this._cur.x ? lefts : rights).filter((li,i)=>i===this._cur.y[this._cur.x])[0]
        selected.classList.add('selected');
        selected.scrollIntoView()
    }
}

    /*
class Hands {
    constructor(lHands,rHands) {
        this._id = 'hands'
        this._hands = [lHands,rHands]
        this._cur = {x:0,y:[0,0]}
        this._size = {height:16}
        this._num = {height:7}
    }
    init() {this.#addEl(); this.#addEvents();}
    get hands() { return this._hands }
    set hands(v) {
        this._hands = v
        document.querySelector(`#left div[name=hands] ol`).replaceWith(this.#make(v[0]))
        document.querySelector(`#right div[name=hands] ol`).replaceWith(this.#make(v[1]))
        this.#showCursor()
    }
    #addEl() {
        console.log(this._hands)
        van.add(document.querySelector(`#left div[name=hands]`), this.#make(this._hands[0]))
        van.add(document.querySelector(`#right div[name=hands]`), this.#make(this._hands[1]))
        document.querySelector(`div[name="${this._id}"] li`).classList.toggle('selected');
        this._size.height = document.querySelector(`div[name="${this._id}"] li`).offsetHeight
    }
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            const y = this._cur.y[this._cur.x]
            if ('ArrowUp'===e.key) {
                this._cur.y[this._cur.x] = 0===y ? this._hands[this._cur.x].length-1 : y-1; this.#showCursor(0,-1); console.log(y); e.preventDefault();}
            else if ('ArrowDown'===e.key) { this._cur.y[this._cur.x] = this._hands[this._cur.x].length-1===y ? 0 : y+1; this.#showCursor(0,+1); console.log(y); e.preventDefault(); }
            else if ('ArrowLeft'===e.key){this._cur.x = 0===this._cur.x ? this._hands.length-1 : this._cur.x-1; this.#showCursor(-1,0); console.log(this._cur.x);e.preventDefault();}
            else if ('ArrowRight'===e.key){this._cur.x = this._hands.length-1===this._cur.x ? 0 : this._cur.x+1; this.#showCursor(+1,0); console.log(this._cur.y); e.preventDefault();}
        })
        window.addEventListener('click', async(e)=>{
            const selected = e.target
            console.log(selected?.parentElement?.tagName?.toLowerCase(), this._id===selected.parentElement.name, selected.parentElement.name, selected.parentElement.getAttribute('name'))
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                [...document.querySelectorAll(`ol[name="hands"] li`)].map(li=>li.classList.remove('selected'));
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                console.log([...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)])
                this._cur.x = 'left'===dirId ? 0 : 1
                this._cur.y[this._cur.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                //this._cur.y[this._cur.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].filter((li,i)=>li===selected)
                selected.classList.add('selected')
//                selected.scrollIntoView()
            }
        })

        window.addEventListener('wheel', (e)=>{
            console.log('wheel:', e.target, e)
            const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
            console.log(dirId)
            console.log(e.target)
            console.log(e.target.parentElement.parentElement.parentElement)
            if (['left','right'].some(id=>id===dirId)) {
                this._cur.x = 'left'===dirId ? 0 : 1
                const firstLi = document.querySelector(`#${dirId} ol[name="hands"] li:first-child`)
                const lastLi = document.querySelector(`#${dirId} ol[name="hands"] li:last-child`)
                const selected = document.querySelector(`#${dirId} ol[name="hands"] li:nth-child(${this._cur.y[this._cur.x]+1})`)
                console.log(firstLi, lastLi, selected, this._cur, this._cur.x, this._hands[this._cur.x][this._cur.y[this._cur.x]]+1)
                // 横
                if (0<e.deltaX || e.deltaX>0) {this._cur.x = ('left'===dirId ? 1 : 0)}
                // 縦
                if (0<e.deltaY) {
                    if (lastLi===selected) { // 末尾から更に下へ行こうとしたとき最上へ
                        this._cur.y[this._cur.x]=0
                        e.target.parentElement.scrollTo(0,0)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,0)
                        console.log('0<e.deltaY if:', this._cur)
                    } else {
                        this._cur.y[this._cur.x]++
                        if (this._hands[this._cur.x].length-1<this._cur.y[this._cur.x]) { this._cur.y[this._cur.x]=this._hands[this._cur.x].length-1 }
                        e.target.parentElement.scrollBy(0,this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,this._size.height)
                        console.log('0<e.deltaY else:', this._cur)
                    }
                }
                if (e.deltaY<0) {
                    if (firstLi===selected) { // 先頭から更に上へ行こうとしたとき最下へ
                        this._cur.y[this._cur.x]=this._hands[this._cur.x].length-1
                        e.target.parentElement.scrollTo(0,this._cur.y[this._cur.x]*this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,this._cur.y[this._cur.x]*this._size.height)
                        console.log('if:', this._cur)
                    } else {
                        this._cur.y[this._cur.x]--
                        if (this._cur.y[this._cur.x]<0) { this._cur.y[this._cur.x]=0 }
                        e.target.parentElement.scrollBy(0,-this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,-this._size.height)
                        console.log('else:', this._cur)
                    }
                }
                this.#showCursor()
                e.preventDefault();
            }
        }, {passive:false})
    }
    #make(hands){return van.tags.ol({name:this._id, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #showCursor(dirX, dirY) {
        const lefts = [...document.querySelectorAll(`#left div[name=hands] li`)]
        const rights = [...document.querySelectorAll(`#right div[name=hands] li`)]
        const lis = [...lefts, ...rights]
        lis.map(li=>li.classList.remove('selected'));
        console.log(this._cur)
        const selected = (0===this._cur.x ? lefts : rights).filter((li,i)=>i===this._cur.y[this._cur.x])[0]
        selected.classList.add('selected');
        selected.scrollIntoView()
    }
}
*/
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
//        if (v<0) { this._x = 0 }
//        else if (this._hands[this._x].length-1<v) { this._x = this._hands[this._x].length-1 }
        if (v<0) { this._x = 1 }
        else if (1<v) { this._x = 0 }
        else { this._x = v }
//        this.show()
        console.debug(`cursor:${this._x},${this._y}`)
    }
    set y(v) {
        const o = this._y[this._x]
//        if (v<0) { this._x = 0 }
//        else if (this._hands[this._x].length-1<v) { this._x = this._hands[this._x].length-1 }
        if (v<0) { this._y[this._x] = 0 }
        else if (this._hands[this._x].length-1<v) { this._y[this._x] = this._hands[this._x].length-1 }
        else { this._y[this._x] = v }
        //this.show()
        console.debug(`cursor:${this._x},${this._y}`)
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
}
//this._csr.xzip().map(([id,i])=>)
class ListUi {
    //constructor(hands) {
    constructor(cur) {
//        this._focus = false
//        this._x = 0
//        this._y = [0, 0]
//        this._hands = hands
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
//            this._hands = v
            this._cur.hands = v
            this.#remake()
            this.show()
        }
        return this._hands
    }
    #addEl() {
        //this._csr.xzip().map(([id,i])=>van.add(document.querySelector(`#${id} div[name=hands]`), this.#make(this._cur.hands[i])))
        van.add(document.querySelector(`#left div[name=hands]`), this.#make(this._cur.hands[0]))
        van.add(document.querySelector(`#right div[name=hands]`), this.#make(this._cur.hands[1]))
        document.querySelector(`div[name="hands"] li`).classList.toggle('selected');
        this._size.height = document.querySelector(`div[name="hands"] li`).offsetHeight
    }
    #make(hands){return van.tags.ol({name:`hands`, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #remake() {
        document.querySelector(`#left div[name=hands] ol`).replaceWith(this.#make(this._cur.hands[0]))
        document.querySelector(`#right div[name=hands] ol`).replaceWith(this.#make(this._cur.hands[1]))
        //this._csr.xzip().map(([id,i])=>document.querySelector(`#${id} div[name=hands] ol`).replaceWith(this.#make(this._cur.hands[i])))
    }
//    get #lefts() { return [...document.querySelector(`#left div[name=hands] ol`)] }
//    get #rights() { return [...document.querySelector(`#right div[name=hands] ol`)] }
    get #lefts() { return [...document.querySelectorAll(`#left ol[name=hands] li`)] }
    get #rights() { return [...document.querySelectorAll(`#right ol[name=hands] li`)] }
    //get selected() { return (0===this._cur.x ? this.#lefts : this.#rights).filter((li,i)=>i===this._cur.y)[0] }
    get selected() { console.log((0===this._cur.x ? this.#lefts : this.#rights),this._cur.x,this._cur.y);return (0===this._cur.x ? this.#lefts : this.#rights).filter((li,i)=>i===this._cur.y)[0] }
    //show() {this.clear(); this.selected.classList.add('selected'); this.selected.scrollIntoView();}
    show() {this.clear(); const selected=this.selected; selected.classList.add('selected'); selected.scrollIntoView();}
    clear() {[...document.querySelectorAll(`ol[name=hands] li`)].map(li=>li.classList.remove('selected'));}
    /*
    get selected() { return (0===this._cur.x ? lefts : rights).filter((li,i)=>i===this._cur.y[this._cur.x])[0] }
    show() {this.clear(); this.selected.classList.add('selected');}
    clear() {[...document.querySelectorAll(`ol[name=hands] li`)].map(li=>li.classList.remove('selected'));}
    clear() {
        const lefts = [...document.querySelectorAll(`#left div[name=hands] li`)]
        const rights = [...document.querySelectorAll(`#right div[name=hands] li`)]
        const lis = [...lefts, ...rights]
        lis.map(li=>li.classList.remove('selected'));
        [...document.querySelectorAll(`ol[name=hands] li`)].map(li=>li.classList.remove('selected'));
    }
    */
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            //const y = this._cur.y[this._cur.x]
            const y = this._cur.y
            if ('ArrowUp'===e.key) {
                this._cur.y = 0===y ? this._cur.len-1 : y-1; this.show(); console.log(y); e.preventDefault();}
                //this._cur.y = 0===y ? this._hands[this._cur.x].length-1 : y-1; this.show(); console.log(y); e.preventDefault();}
                //this._cur.y[this._cur.x] = 0===y ? this._hands[this._cur.x].length-1 : y-1; this.#showCursor(0,-1); console.log(y); e.preventDefault();}
            else if ('ArrowDown'===e.key) { this._cur.y = this._cur.len-1===y ? 0 : y+1; this.show(); console.log(y); e.preventDefault(); }
            else if ('ArrowLeft'===e.key){this._cur.x = 0===this._cur.x ? this._cur.len-1 : this._cur.x-1; this.show(); console.log(this._cur.x);e.preventDefault();}
            else if ('ArrowRight'===e.key){this._cur.x = this._cur.len-1===this._cur.x ? 0 : this._cur.x+1; this.show(); console.log(this._cur.y); e.preventDefault();}
//            else if ('ArrowDown'===e.key) { this._cur.y = this._hands[this._cur.x].length-1===y ? 0 : y+1; this.show(); console.log(y); e.preventDefault(); }
//            else if ('ArrowLeft'===e.key){this._cur.x = 0===this._cur.x ? this._hands.length-1 : this._cur.x-1; this.show(); console.log(this._cur.x);e.preventDefault();}
//            else if ('ArrowRight'===e.key){this._cur.x = this._hands.length-1===this._cur.x ? 0 : this._cur.x+1; this.show(); console.log(this._cur.y); e.preventDefault();}
        })
        window.addEventListener('mouseenter', async(e)=>{
            const selected = e.target
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                if (!['left','right'].some(v=>v===dirId)) {return}
                this._cur.xid = dirId
//                this._cur.x = 'left'===dirId ? 0 : 1
                this._cur.y = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                this.show()
//                selected.scrollIntoView()
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
                //this._cur.x = 'left'===dirId ? 0 : 1
                this._cur.y = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                //this._cur.y[this._cur.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                //this._cur.y[this._cur.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].filter((li,i)=>li===selected)
                this.show()
//                selected.classList.add('selected')
//                selected.scrollIntoView()
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
                //this._cur.x = 'left'===dirId ? 0 : 1
                const firstLi = document.querySelector(`#${dirId} ol[name="hands"] li:first-child`)
                const lastLi = document.querySelector(`#${dirId} ol[name="hands"] li:last-child`)
                //const selected = document.querySelector(`#${dirId} ol[name="hands"] li:nth-child(${this._cur.y[this._cur.x]+1})`)
                const selected = document.querySelector(`#${dirId} ol[name="hands"] li:nth-child(${this._cur.y+1})`)
                console.log(firstLi, lastLi, selected, this._cur, this._cur.x, this._cur.hands[this._cur.x][this._cur.y[this._cur.x]]+1)
                // 横
                //if (0<e.deltaX || e.deltaX>0) {this._cur.x = ('left'===dirId ? 1 : 0)}
                //if (0<e.deltaX || e.deltaX>0) {this._cur.xid = dirId)}
                if (0<e.deltaX) {this._cur.x = (1===this._cur.x ? 0 : 1)} // 右端から更に右へ行こうとしたとき左端へ移動する
                if (e.deltaX>0) {this._cur.x = (0===this._cur.x ? 1 : 0)} // 左端から更に左へ行こうとしたとき右端へ移動する
                // 縦
                if (0<e.deltaY) {
                    if (lastLi===selected) { // 末尾から更に下へ行こうとしたとき最上へ
                        //this._cur.y[this._cur.x]=0
                        this._cur.y=0
                        e.target.parentElement.scrollTo(0,0)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,0)
                        console.log('0<e.deltaY if:', this._cur)
                    } else {
                        //this._cur.y[this._cur.x]++
                        this._cur.y++
                        //if (this._hands[this._cur.x].length-1<this._cur.y[this._cur.x]) { this._cur.y[this._cur.x]=this._hands[this._cur.x].length-1 }
                        //if (this._hands[this._cur.x].length-1<this._cur.y) { this._cur.y=this._hands[this._cur.x].length-1 }
                        if (this._cur.len-1<this._cur.y) { this._cur.y=this._cur.len-1 }
                        e.target.parentElement.scrollBy(0,this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,this._size.height)
                        console.log('0<e.deltaY else:', this._cur)
                    }
                }
                if (e.deltaY<0) {
                    if (firstLi===selected) { // 先頭から更に上へ行こうとしたとき最下へ
                        //this._cur.y[this._cur.x]=this._hands[this._cur.x].length-1
                        //this._cur.y=this._hands[this._cur.x].length-1
                        this._cur.y=this._cur.len-1
                        //e.target.parentElement.scrollTo(0,this._cur.y[this._cur.x]*this._size.height)
                        e.target.parentElement.scrollTo(0,this._cur.y*this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,this._cur.y[this._cur.x]*this._size.height)
                        console.log('if:', this._cur)
                    } else {
                        //this._cur.y[this._cur.x]--
                        this._cur.y--
                        //if (this._cur.y[this._cur.x]<0) { this._cur.y[this._cur.x]=0 }
                        if (this._cur.y<0) { this._cur.y=0 }
                        e.target.parentElement.scrollBy(0,-this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,-this._size.height)
                        console.log('else:', this._cur)
                    }
                }
                this.show()
                e.preventDefault();
            }
        }, {passive:false})
    }
}
//window.Hands = new Hands([])
//window.Hands = new Hands([''])
//window.Hands = new Hands(['A'])
window.Hands = new Hands(['A','B','C'], ['X','Y','Z'])
})();
