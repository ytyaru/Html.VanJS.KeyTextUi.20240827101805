;(function(){
class Display {
    constructor() {
        this._el = this.#make()
    }
    get el() { return this._el }
    init() {van.add(document.body, this.#make())}
    #make() { return van.tags.main({id:`display`, style:()=>this.#style()},
            ['left','right'].map(id=>this.#makeChildren(id)),
    )}
    #style(){return `padding:0;margin:0;column-count:2;column-gap:0;`}
    #makeChildren(id) {
        return van.tags.div({id:id},
            van.tags.div({name:`status`},
                van.tags.div({name:`name`},`名`),
                van.tags.div({name:`state`},`状`),
                van.tags.div({name:`power`},`Ｓ`),
                van.tags.div({name:`card`},`Ｃ`),
            ),
            van.tags.div({name:`hands`}),
        )
    }
}
window.Display = new Display();
})();
