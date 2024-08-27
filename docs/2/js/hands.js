;(function(){
class Hands {
    constructor(hands) {
        this._hands = van.state(hands)
        this._el = van.tags.ol(hands.map(h=>van.tags.li(h)))
        this._keyPos = {x: van.state(0), y: van.state(0)}
    }
    init() {
        this.#addEl()
        this.#addEvents()
    }
    get hands() { return this._hands.val }
    set hands(v) {
        this._hands.val = v
        document.querySelector('#cursor-target').replaceWith(this.#make())
        this.#showCursor()
    }
    #addEl() {
        console.log(this._hands.val)
        van.add(document.body, this.#make())
        document.querySelector('#cursor-target > li').classList.toggle('selected');
    }
    #addEvents() {
        window.addEventListener('keydown', async(e)=>{
            // ctrlKey, isComposing, metaKey, repeat, shiftKey
            if ('ArrowUp'===e.key) { this._keyPos.y.val = 0===this._keyPos.y.val ? this._hands.val.length-1 : this._keyPos.y.val-1; this.#showCursor(); console.log(this._keyPos.y.val); }
            if ('ArrowDown'===e.key) { this._keyPos.y.val = this._hands.val.length-1===this._keyPos.y.val ? 0 : this._keyPos.y.val+1; this.#showCursor(); console.log(this._keyPos.y.val);  }
            if ('ArrowLeft'===e.key){}
            if ('ArrowRight'===e.key){}
        })
    }
    #make(){return van.tags.ol({id:'cursor-target'}, this._hands.val.map((v,i)=>van.tags.li(v)))}
    #showCursor() {
        [...document.querySelectorAll('#cursor-target > li')].map(li=>li.classList.remove('selected'));
        [...document.querySelectorAll('#cursor-target > li')].filter((li,i)=>i===this._keyPos.y.val)[0].classList.add('selected');
    }
}
//window.Hands = new Hands([])
//window.Hands = new Hands([''])
//window.Hands = new Hands(['A'])
window.Hands = new Hands(['A','B','C'])
})();
