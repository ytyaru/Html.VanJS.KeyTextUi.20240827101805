;(function(){
class Display {
    constructor() {}
    get el() { return this._el }
    init() {van.add(document.body, this.#makeMain())}
    #style(){return `box-sizing:border-box;padding:0;margin:0;column-count:2;column-gap:0;`}
    #makeMain() { return van.tags.main({id:`display`},
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
            van.tags.div({name:`text`}, van.tags.div(...(('left'===id) ? [{name:`description`,onclick:(e)=>this.swapText()},`D`] : [{name:`log`},`L`]))),
            /*
            van.tags.div({name:`text`},
                //van.tags.div({name:`description`},`D`),
                van.tags.div({name:`description`,onclick:(e)=>this.swapText()},`D`),
                van.tags.div({name:`log`},`L`),
            )
            */
        )
    }
    #makeHeader() { return van.tags.header({id:`header`},`場`) }
    /*
    #makeText() { return van.tags.div({name:`text`, style:`box-sizing:border-box;padding:0;margin:0;column-count:2;column-gap:0;`},
        van.tags.div({name:`description`},`D`),
        van.tags.div({name:`log`},`L`),
    ) }
    */
    #makeFooter() { return van.tags.footer({id:`footer`},`設定`) }
    swapText() {
        const leftP = document.querySelector(`#left div[name="text"]`)
        const rightP = document.querySelector(`#right div[name="text"]`)
        const leftC = document.querySelector(`#left div[name="text"] div`)
        const rightC = document.querySelector(`#right div[name="text"] div`)
        leftP.appendChild(rightC)
        rightP.appendChild(leftC)
        /*
        const left = document.querySelector(`#left div[name="text"] div`)
        const right = document.querySelector(`#right div[name="text"] div`)
        const text = document.querySelector(`div[name="text"]`)
        const desc = text.querySelector(`div[name="description"]`)
        console.log('swap:', text, desc)
//        const log = text.querySelector(`div[name="log"]`)
        text.appendChild(desc) // 既存要素を追加すると移動する
        */
    }
}
window.Display = new Display();
})();
