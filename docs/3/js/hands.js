;(function(){
class Hands {
    constructor(hands) {
        this._id = 'hands'
        this._hands = van.state(hands)
        this._el = van.tags.ol(hands.map(h=>van.tags.li(h)))
        this._keyPos = {x: van.state(0), y: van.state(0)}
        this._size = {height:van.state(16)}
        this._num = {height:van.state(7)}
    }
    init() {
        this.#addEl()
        this.#addEvents()
    }
    get hands() { return this._hands.val }
    set hands(v) {
        this._hands.val = v
        document.querySelector(`#${this._id}`).replaceWith(this.#make())
        this.#showCursor()
    }
    #addEl() {
        console.log(this._hands.val)
        van.add(document.body, this.#make())
        document.querySelector(`#${this._id} > li`).classList.toggle('selected');
        this._size.height.val = document.querySelector(`#${this._id} > li`).offsetHeight
    }
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            if ('ArrowUp'===e.key) { this._keyPos.y.val = 0===this._keyPos.y.val ? this._hands.val.length-1 : this._keyPos.y.val-1; this.#showCursor(-1); console.log(this._keyPos.y.val); }
            if ('ArrowDown'===e.key) { this._keyPos.y.val = this._hands.val.length-1===this._keyPos.y.val ? 0 : this._keyPos.y.val+1; this.#showCursor(+1); console.log(this._keyPos.y.val);  }
            if ('ArrowLeft'===e.key){}
            if ('ArrowRight'===e.key){}
        })
    }
    //#make(){return van.tags.ol({id:this._id, style:()=>`max-height:100px;overflow-y:auto;`}, this._hands.val.map((v,i)=>van.tags.li(v)))}
    //#make(){return van.tags.ol({id:this._id, style:()=>`max-height:${this._size.height.val*7}px;overflow-y:auto;`}, this._hands.val.map((v,i)=>van.tags.li(v)))}
    #make(){return van.tags.ol({id:this._id, style:()=>`max-height:${this._size.height.val*this._num.height.val}px;overflow-y:auto;`}, this._hands.val.map((v,i)=>van.tags.li(v)))}

    #showCursor(dir) {
        const lis = [...document.querySelectorAll(`#${this._id} > li`)]
        lis.map(li=>li.classList.remove('selected'));
        const selected = lis.filter((li,i)=>i===this._keyPos.y.val)[0]
        selected.classList.add('selected');
        selected.scrollIntoView()
        //this._num.height.val
        //selected.scrollTo(0, this._size.height * this._keyPos.y.val)
//        console.log(this._size.height.val * this._keyPos.y.val)
//        if (0<dir && this._keyPos.y.val<(this._num.height.val/2)){return}
//        if (dir<0 && this._hands.val.length-(this._num.height.val/2)<this._keyPos.y.val && 0!==this._keyPos.y.val){return}
//        document.querySelector(`#${this._id}`).scrollTo(0, this._size.height.val * this._keyPos.y.val)
    }
}
//window.Hands = new Hands([])
//window.Hands = new Hands([''])
//window.Hands = new Hands(['A'])
window.Hands = new Hands(['A','B','C'])
})();
