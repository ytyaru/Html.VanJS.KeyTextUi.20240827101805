;(function(){
class Hands {
    constructor(lHands,rHands) {
        this._id = 'hands'
        this._hands = [lHands,rHands]
        this._keyPos = {x:0,y:0}
        this._size = {height:16}
        this._num = {height:7}
    }
    init() {
        this.#addEl()
        this.#addEvents()
    }
    get hands() { return this._hands }
    set hands(v) {
        this._hands = v
        document.querySelector(`#left ol`).replaceWith(this.#make(v[0]))
        document.querySelector(`#right ol`).replaceWith(this.#make(v[1]))
        this.#showCursor()
    }
    #addEl() {
        console.log(this._hands)
        van.add(document.querySelector(`#left`), this.#make(this._hands[0]))
        van.add(document.querySelector(`#right`), this.#make(this._hands[1]))
        document.querySelector(`#${this._id} > li`).classList.toggle('selected');
        this._size.height = document.querySelector(`#${this._id} > li`).offsetHeight
    }
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            if ('ArrowUp'===e.key) { this._keyPos.y = 0===this._keyPos.y ? this._hands[this._keyPos.x].length-1 : this._keyPos.y-1; this.#showCursor(0,-1); console.log(this._keyPos.y); }
            else if ('ArrowDown'===e.key) { this._keyPos.y = this._hands[this._keyPos.x].length-1===this._keyPos.y ? 0 : this._keyPos.y+1; this.#showCursor(0,+1); console.log(this._keyPos.y);  }
            else if ('ArrowLeft'===e.key){this._keyPos.x = 0===this._keyPos.x ? this._hands.length-1 : this._keyPos.x-1; this.#showCursor(-1,0); console.log(this._keyPos.x);}
            else if ('ArrowRight'===e.key){this._keyPos.x = this._hands.length-1===this._keyPos.x ? 0 : this._keyPos.x+1; this.#showCursor(+1,0); console.log(this._keyPos.y); }
        })
    }
    #make(hands){return van.tags.ol({id:this._id, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}
    #showCursor(dirX, dirY) {
        const lefts = [...document.querySelectorAll(`#left li`)]
        const rights = [...document.querySelectorAll(`#right li`)]
        //const lis = [...document.querySelectorAll(`main li`)]
        const lis = [...lefts, ...rights]
//        console.log(lefts, rights, lis)
        lis.map(li=>li.classList.remove('selected'));
//        console.log(this._keyPos.x)
//        console.log((0===this._keyPos.x ? lefts : rights))
        const selected = (0===this._keyPos.x ? lefts : rights).filter((li,i)=>i===this._keyPos.y)[0]
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
