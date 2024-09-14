window.addEventListener('DOMContentLoaded', async(event)=>{
    console.log('DOMContentLoaded!!');

//    const pager = new Pager()
//    pager.items = [...Array(100)].map((_,i)=>i)
//    van.add(document.body, pager.el)

//    const pager = new Pager([...Array(100)].map((_,i)=>i))
//    van.add(document.body, pager.el)

    const pager = new Pager({
        row:3,
        height:64,
        items:[...Array(100)].map((_,i)=>i),
    })
    van.add(document.body, pager.el)




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

