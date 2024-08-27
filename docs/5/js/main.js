window.addEventListener('DOMContentLoaded', async(event)=>{
    console.log('DOMContentLoaded!!');
    Hands.init()
//    Hands.hands = ['X','Y','Z','A']
//    Hands.hands = [...Array(5)].map((_,i)=>i)
//    Hands.hands = [...Array(100)].map((_,i)=>i)
    const hands = [...Array(100)].map((_,i)=>i)
    Hands.hands = [hands.filter(v=>0===v%2), hands.filter(v=>1===v%2)]
});
window.addEventListener('beforeunload', async(event) => {
    console.log('beforeunload!!');
});

