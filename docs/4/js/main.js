window.addEventListener('DOMContentLoaded', async(event)=>{
    console.log('DOMContentLoaded!!');
    Hands.init()
//    Hands.hands = ['X','Y','Z','A']
//    Hands.hands = [...Array(5)].map((_,i)=>i)
    Hands.hands = [...Array(100)].map((_,i)=>i)
});
window.addEventListener('beforeunload', async(event) => {
    console.log('beforeunload!!');
});

