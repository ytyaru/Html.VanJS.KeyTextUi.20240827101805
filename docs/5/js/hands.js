;(function(){
class Hands {
    constructor(lHands,rHands) {
        this._id = 'hands'
        //this._hands = van.state(hands)
        this._hands = [lHands,rHands]
//        this._el = van.tags.ol(hands.map(h=>van.tags.li(h)))
        this._keyPos = {x:0,y:0}
        this._size = {height:16}
        this._num = {height:7}
        //this._keyPos = {x: van.state(0), y: van.state(0)}
        //this._size = {height:van.state(16)}
        //this._num = {height:van.state(7)}
    }
    init() {
        this.#addEl()
        this.#addEvents()
    }
    //get hands() { return this._hands.val }
    get hands() { return this._hands }
    set hands(v) {
        //this._hands.val = v
        this._hands = v
        //document.querySelector(`#${this._id}`).replaceWith(this.#make())
        document.querySelector(`#left ol`).replaceWith(this.#make(v[0]))
        document.querySelector(`#right ol`).replaceWith(this.#make(v[1]))
        this.#showCursor()
    }
    #addEl() {
        console.log(this._hands)
        //console.log(this._hands.val)
        //van.add(document.body, this.#make())
        van.add(document.querySelector(`#left`), this.#make(this._hands[0]))
        van.add(document.querySelector(`#right`), this.#make(this._hands[1]))
        document.querySelector(`#${this._id} > li`).classList.toggle('selected');
        //this._size.height.val = document.querySelector(`#${this._id} > li`).offsetHeight
        this._size.height = document.querySelector(`#${this._id} > li`).offsetHeight
    }
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            /*
            if ('ArrowUp'===e.key) { this._keyPos.y.val = 0===this._keyPos.y.val ? this._hands.val.length-1 : this._keyPos.y.val-1; this.#showCursor(-1); console.log(this._keyPos.y.val); }
            if ('ArrowDown'===e.key) { this._keyPos.y.val = this._hands.val.length-1===this._keyPos.y.val ? 0 : this._keyPos.y.val+1; this.#showCursor(+1); console.log(this._keyPos.y.val);  }
            if ('ArrowLeft'===e.key){}
            if ('ArrowRight'===e.key){}
            */
            if ('ArrowUp'===e.key) { this._keyPos.y = 0===this._keyPos.y ? this._hands[this._keyPos.x].length-1 : this._keyPos.y-1; this.#showCursor(0,-1); console.log(this._keyPos.y); }
            else if ('ArrowDown'===e.key) { this._keyPos.y = this._hands[this._keyPos.x].length-1===this._keyPos.y ? 0 : this._keyPos.y+1; this.#showCursor(0,+1); console.log(this._keyPos.y);  }
            else if ('ArrowLeft'===e.key){this._keyPos.x = 0===this._keyPos.x ? this._hands.length-1 : this._keyPos.x-1; this.#showCursor(-1,0); console.log(this._keyPos.x);}
            else if ('ArrowRight'===e.key){this._keyPos.x = this._hands.length-1===this._keyPos.x ? 0 : this._keyPos.x+1; this.#showCursor(+1,0); console.log(this._keyPos.y); }
        })
    }
    //#make(){return van.tags.ol({id:this._id, style:()=>`max-height:100px;overflow-y:auto;`}, this._hands.val.map((v,i)=>van.tags.li(v)))}
    //#make(){return van.tags.ol({id:this._id, style:()=>`max-height:${this._size.height.val*7}px;overflow-y:auto;`}, this._hands.val.map((v,i)=>van.tags.li(v)))}
    //#make(){return van.tags.ol({id:this._id, style:()=>`max-height:${this._size.height.val*this._num.height.val}px;overflow-y:auto;`}, this._hands.val.map((v,i)=>van.tags.li(v)))}
    #make(hands){return van.tags.ol({id:this._id, style:()=>`max-height:${this._size.height*this._num.height}px;overflow-y:auto;`}, hands.map((v,i)=>van.tags.li(v)))}

    #showCursor(dirX, dirY) {
        //const lis = [...document.querySelectorAll(`#${this._id} > li`)]
        const lefts = [...document.querySelectorAll(`#left li`)]
        const rights = [...document.querySelectorAll(`#right li`)]
        //const lis = [...document.querySelectorAll(`main li`)]
        const lis = [...lefts, ...rights]
        console.log(lefts, rights, lis)
        lis.map(li=>li.classList.remove('selected'));
        //const selected = lis.filter((li,i)=>i===this._keyPos.y.val)[0]
        //const selected = lis.filter((li,i)=>i===this._keyPos.y)[0]
        //const selected = this._hands[this._keyPos.x].filter((li,i)=>i===this._keyPos.y)[0]
        console.log(this._keyPos.x)
        console.log((0===this._keyPos.x ? lefts : rights))
        const selected = (0===this._keyPos.x ? lefts : rights).filter((li,i)=>i===this._keyPos.y)[0]
        console.log(selected)
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
