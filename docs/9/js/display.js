;(function(){
class Display {
    constructor() {
        this._el = this.#make()
    }
    get el() { return this._el }
    init() {van.add(document.body, this.#make())}
    #style(){return `padding:0;margin:0;column-count:2;column-gap:0;`}
    #make() { return van.tags.main({id:`display`},
            van.tags.div({style:()=>this.#style()}, ['left','right'].map(id=>this.#makeChildren(id)))
    )}
    #makeChildren(id) {
        return van.tags.div({id:id},
            van.tags.div({name:`status`},
                van.tags.div({name:`name`},`名`),
                van.tags.div({name:`state`},`状`),
                van.tags.div({name:`power`},`Ｓ`),
                van.tags.div({name:`card`},`Ｃ`),
            ),
            //van.tags.div({name:`hands`}),
            van.tags.div({name:`cards`},
                van.tags.div({name:`hands`}),
                van.tags.div({name:`details`,style:`display:none;`}),
            ),
        )
    }
}
window.Display = new Display();
})();
