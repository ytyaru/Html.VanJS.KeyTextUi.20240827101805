window.addEventListener('DOMContentLoaded', async(event)=>{
    console.log('DOMContentLoaded!!');

//    const pager = new Pager()
//    pager.items = [...Array(100)].map((_,i)=>i)
//    van.add(document.body, pager.el)

//    const pager = new Pager([...Array(100)].map((_,i)=>i))
//    van.add(document.body, pager.el)

    /*
    const pager = new Pager({
        row:3,
        height:64,
        onShow:(data)=>`${data}番`,
        items:[...Array(100)].map((_,i)=>i),
    })
    van.add(document.body, pager.el)
    */

    /*
    function onShow(id) {
        switch(id) {
            case 0: return `0です`
            case 1: return `1なの`
            case 2: return `2だろ`
            default: return `${id}番`
        }
    }
    const pager = new Pager({
        row:5,
        height:64,
        onShow:onShow,
        items:[...Array(100)].map((_,i)=>i),
    })
    van.add(document.body, pager.el)
    */
    /*
    const pager = new Pager({
        row:5,
        height:64,
        onShow:(id)=>{
            switch(id) {
                case 0: return `0です`
                case 1: return `1なの`
                case 2: return `2だろ`
                default: return `${id}番`
            }
        },
        items:[...Array(100)].map((_,i)=>i),
    })
    van.add(document.body, pager.el)
    */
    const list = new List({
        row:5,
        height:64,
        onShow:(id)=>{
            switch(id) {
                case 0: return `0です`
                case 1: return `1なの`
                case 2: return `2だろ`
                default: return `${id}番`
            }
        },
        items:[...Array(100)].map((_,i)=>i),
    })
    van.add(document.body, list.el)


    /*
    Display.init();
    Hands.init()
//    Hands.hands = ['X','Y','Z','A']
//    Hands.hands = [...Array(5)].map((_,i)=>i)
//    Hands.hands = [...Array(100)].map((_,i)=>i)
    const hands = [...Array(100)].map((_,i)=>i)
    Hands.hands = [hands.filter(v=>0===v%2), hands.filter(v=>1===v%2)]
    */
});
window.addEventListener('beforeunload', async(event) => {
    console.log('beforeunload!!');
});

