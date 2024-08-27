window.addEventListener('DOMContentLoaded', async(event)=>{
    console.log('DOMContentLoaded!!');

    const keyPos = {
        x: van.state(0),
        y: van.state(0),
    }
    const hands = ['A','B','C']
    van.add(document.body, van.tags.ol({id:'cursor-target'}, hands.map(([v,i])=>van.tags.li(v))))
    document.querySelector('#cursor-target > li').classList.toggle('selected');
    function resetCursor() {
        [...document.querySelectorAll('#cursor-target > li')].map(li=>li.classList.remove('selected'));
        [...document.querySelectorAll('#cursor-target > li')].filter((li,i)=>i===keyPos.y.val)[0].classList.add('selected');
    }
    window.addEventListener('keydown', async(e)=>{
        // ctrlKey, isComposing, metaKey, repeat, shiftKey
        if ('ArrowUp'===e.key) { keyPos.y.val = 0===keyPos.y.val ? hands.length-1 : keyPos.y.val-1; resetCursor(); console.log(keyPos.y.val); }
        if ('ArrowDown'===e.key) { keyPos.y.val = hands.length-1===keyPos.y.val ? 0 : keyPos.y.val+1; resetCursor(); console.log(keyPos.y.val);  }
        if ('ArrowLeft'===e.key){}
        if ('ArrowRight'===e.key){}
    })
    
});
window.addEventListener('beforeunload', async(event) => {
    console.log('beforeunload!!');
});

