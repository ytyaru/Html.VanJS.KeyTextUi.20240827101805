;(function(){
class Hands {
    constructor(lHands,rHands) {
        this._id = 'hands'
        this._hands = [lHands,rHands]
        this._keyPos = {x:0,y:[0,0]}
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
            const y = this._keyPos.y[this._keyPos.x]
            if ('ArrowUp'===e.key) {
                this._keyPos.y[this._keyPos.x] = 0===y ? this._hands[this._keyPos.x].length-1 : y-1; this.#showCursor(0,-1); console.log(y); e.preventDefault();}
            else if ('ArrowDown'===e.key) { this._keyPos.y[this._keyPos.x] = this._hands[this._keyPos.x].length-1===y ? 0 : y+1; this.#showCursor(0,+1); console.log(y); e.preventDefault(); }
            else if ('ArrowLeft'===e.key){this._keyPos.x = 0===this._keyPos.x ? this._hands.length-1 : this._keyPos.x-1; this.#showCursor(-1,0); console.log(this._keyPos.x);e.preventDefault();}
            else if ('ArrowRight'===e.key){this._keyPos.x = this._hands.length-1===this._keyPos.x ? 0 : this._keyPos.x+1; this.#showCursor(+1,0); console.log(this._keyPos.y); e.preventDefault();}
        })
        window.addEventListener('click', async(e)=>{
            const selected = e.target
            console.log(selected.parentElement.tagName.toLowerCase(), this._id===selected.parentElement.name, selected.parentElement.name, selected.parentElement.getAttribute('name'))
            if ('ol'===selected.parentElement.tagName.toLowerCase() && this._id===selected.parentElement.getAttribute('name')) {
                [...document.querySelectorAll(`ol[name="hands"] li`)].map(li=>li.classList.remove('selected'));
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                console.log([...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)])
                this._keyPos.x = 'left'===dirId ? 0 : 1
                this._keyPos.y[this._keyPos.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].map((li,i)=>[li,i]).filter(([li,i])=>li===selected)[0][1]
                //this._keyPos.y[this._keyPos.x] = [...document.querySelectorAll(`#${dirId} ol[name="hands"] li`)].filter((li,i)=>li===selected)
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
                this._keyPos.x = 'left'===dirId ? 0 : 1
                const firstLi = document.querySelector(`#${dirId} ol[name="hands"] li:first-child`)
                const lastLi = document.querySelector(`#${dirId} ol[name="hands"] li:last-child`)
                const selected = document.querySelector(`#${dirId} ol[name="hands"] li:nth-child(${this._keyPos.y[this._keyPos.x]+1})`)
                console.log(firstLi, lastLi, selected, this._keyPos, this._keyPos.x, this._hands[this._keyPos.x][this._keyPos.y[this._keyPos.x]]+1)
                // 横
                if (0<e.deltaX || e.deltaX>0) {this._keyPos.x = ('left'===dirId ? 1 : 0)}
                // 縦
                if (0<e.deltaY) {
                    if (lastLi===selected) { // 末尾から更に下へ行こうとしたとき最上へ
                        this._keyPos.y[this._keyPos.x]=0
                        e.target.parentElement.scrollTo(0,0)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,0)
                        console.log('0<e.deltaY if:', this._keyPos)
                    } else {
                        this._keyPos.y[this._keyPos.x]++
                        if (this._hands[this._keyPos.x].length-1<this._keyPos.y[this._keyPos.x]) { this._keyPos.y[this._keyPos.x]=this._hands[this._keyPos.x].length-1 }
                        e.target.parentElement.scrollBy(0,this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,this._size.height)
                        console.log('0<e.deltaY else:', this._keyPos)
                    }
                }
                if (e.deltaY<0) {
                    if (firstLi===selected) { // 先頭から更に上へ行こうとしたとき最下へ
                        this._keyPos.y[this._keyPos.x]=this._hands[this._keyPos.x].length-1
                        e.target.parentElement.scrollTo(0,this._keyPos.y[this._keyPos.x]*this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollTo(0,this._keyPos.y[this._keyPos.x]*this._size.height)
                        console.log('if:', this._keyPos)
                    } else {
                        this._keyPos.y[this._keyPos.x]--
                        if (this._keyPos.y[this._keyPos.x]<0) { this._keyPos.y[this._keyPos.x]=0 }
                        e.target.parentElement.scrollBy(0,-this._size.height)
                        //document.querySelector(`#${dirId} ol[name="hands"]`).scrollBy(0,-this._size.height)
                        console.log('else:', this._keyPos)
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
        console.log(this._keyPos)
        const selected = (0===this._keyPos.x ? lefts : rights).filter((li,i)=>i===this._keyPos.y[this._keyPos.x])[0]
        selected.classList.add('selected');
        selected.scrollIntoView()
    }
}
class KeyPos {
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
        this.show()
    }
    set y(v) {
        const o = this._y[this._x]
//        if (v<0) { this._x = 0 }
//        else if (this._hands[this._x].length-1<v) { this._x = this._hands[this._x].length-1 }
        if (v<0) { this._y[this._x] = 0 }
        else if (this._hands[this._x].length-1<v) { this._y[this._x] = this._hands[this._x].length-1 }
        else { this._x = v }
        this.show()
    }
    show() {
        const lefts = [...document.querySelectorAll(`#left div[name=hands] li`)]
        const rights = [...document.querySelectorAll(`#right div[name=hands] li`)]
        const lis = [...lefts, ...rights]
        lis.map(li=>li.classList.remove('selected'));
        selected.classList.add('selected');
    }
}
class ListUi {
}
//window.Hands = new Hands([])
//window.Hands = new Hands([''])
//window.Hands = new Hands(['A'])
window.Hands = new Hands(['A','B','C'], ['X','Y','Z'])
})();
