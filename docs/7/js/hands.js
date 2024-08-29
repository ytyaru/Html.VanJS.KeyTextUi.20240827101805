;(function(){
class Hands {
    constructor(lHands,rHands) {
        this._id = 'hands'
        this._hands = [lHands,rHands]
        //this._keyPos = {x:0,y:0}
        this._keyPos = {x:0,y:[0,0]}
        this._size = {height:16}
        this._num = {height:7}
    }
    init() {this.#addEl(); this.#addEvents();}
    get hands() { return this._hands }
    set hands(v) {
        this._hands = v
        console.log(document.querySelector(`#left div[name=hands] ol`))
        document.querySelector(`#left div[name=hands] ol`).replaceWith(this.#make(v[0]))
        document.querySelector(`#right div[name=hands] ol`).replaceWith(this.#make(v[1]))
//        document.querySelector(`#left ol`).replaceWith(this.#make(v[0]))
//        document.querySelector(`#right ol`).replaceWith(this.#make(v[1]))
        this.#showCursor()
    }
    #addEl() {
        console.log(this._hands)
        van.add(document.querySelector(`#left div[name=hands]`), this.#make(this._hands[0]))
        van.add(document.querySelector(`#right div[name=hands]`), this.#make(this._hands[1]))
//        van.add(document.querySelector(`#left`), this.#make(this._hands[0]))
//        van.add(document.querySelector(`#right`), this.#make(this._hands[1]))
        //document.querySelector(`#${this._id} > li`).classList.toggle('selected');
        console.log(document.querySelector(`div[name="${this._id}"]`))
        console.log(document.querySelector(`div[name="${this._id}"] > li`))
        console.log(document.querySelector(`div[name="${this._id}"] li`))
        document.querySelector(`div[name="${this._id}"] li`).classList.toggle('selected');
        //this._size.height = document.querySelector(`#${this._id} > li`).offsetHeight
        this._size.height = document.querySelector(`div[name="${this._id}"] li`).offsetHeight
    }
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            //if ('ArrowUp'===e.key) { this._keyPos.y = 0===this._keyPos.y ? this._hands[this._keyPos.x].length-1 : this._keyPos.y-1; this.#showCursor(0,-1); console.log(this._keyPos.y); e.preventDefault();}
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
                [...document.querySelectorAll(`div[name="hands"] li`)].map(li=>li.classList.remove('selected'));
                selected.classList.add('selected')
                selected.scrollIntoView()
            }
        })
        for(let target of [...document.querySelectorAll(`ol[name="hands"]`)]) {
            target.addEventListener('wheel', async(e)=>{
            //window.addEventListener('wheel', async(e)=>{
    //            console.log(e.deltaY, e.deltaMode, e.wheelDeltaY)
                console.log(e.deltaY, e.target)
    //            if (0<e.deltaY) {this._keyPos.y[this._keyPos.x]++;e.target.parentElement.scrollBy(0,this._size.height)}
    //            if (e.deltaY<0) {this._keyPos.y[this._keyPos.x]--;e.target.parentElement.scrollBy(0,-this._size.height)}
                const dirId = e.target.parentElement?.parentElement?.parentElement?.parentElement?.id
                console.log(e.target)
                console.log(e.target.parentElement.parentElement.parentElement.parentElement)
                if (['left','right'].some(id=>id===e.target.parentElement.parentElement.parentElement.parentElement.id)) {
                    this._keyPos.x = 'left'===dirId ? 0 : 1
                    //this._keyPos.x = 'left'===e.target.parentElement.parentElement.parentElement.parentElement.id ? 0 : 1
                    if (0<e.deltaY) {
                        if (e.target===e.target.parentElement.lastElementChild) { // 末尾から更に下へ行こうとしたとき最上へ
                            this._keyPos.y[this._keyPos.x]=0
                            e.target.parentElement.scrollTo(0,0)
                        } else {
                            this._keyPos.y[this._keyPos.x]++
                            e.target.parentElement.scrollBy(0,this._size.height)
                        }
                    }
                    if (e.deltaY<0) {
                        if (e.target===e.target.parentElement.firstElementChild) { // 先頭から更に上へ行こうとしたとき最下へ
                            this._keyPos.y[this._keyPos.x]=this._hands[this._keyPos.x].length-1
                            e.target.parentElement.scrollTo(0,this._keyPos.y[this._keyPos.x]*this._size.height)
                        } else {
                            this._keyPos.y[this._keyPos.x]--
                            e.target.parentElement.scrollBy(0,-this._size.height)
                        }
                    }
                    this.#showCursor()
                    e.preventDefault();
                }
            }, {passive:false})

        }
    }
//    #make(hands){return van.tags.ol({id:this._id, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #make(hands){return van.tags.ol({name:this._id, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #showCursor(dirX, dirY) {
//        const lefts = [...document.querySelectorAll(`#left li`)]
//        const rights = [...document.querySelectorAll(`#right li`)]
        const lefts = [...document.querySelectorAll(`#left div[name=hands] li`)]
        const rights = [...document.querySelectorAll(`#right div[name=hands] li`)]
        //const lis = [...document.querySelectorAll(`main li`)]
        const lis = [...lefts, ...rights]
//        console.log(lefts, rights, lis)
        lis.map(li=>li.classList.remove('selected'));
//        console.log(this._keyPos.x)
//        console.log((0===this._keyPos.x ? lefts : rights))
        const selected = (0===this._keyPos.x ? lefts : rights).filter((li,i)=>i===this._keyPos.y[this._keyPos.x])[0]
//        console.log(selected)
        selected.classList.add('selected');
        selected.scrollIntoView()
//        document.querySelector(`#right`).innerText = `${selected.textContent}`
    }
}
//window.Hands = new Hands([])
//window.Hands = new Hands([''])
//window.Hands = new Hands(['A'])
window.Hands = new Hands(['A','B','C'], ['X','Y','Z'])
})();
