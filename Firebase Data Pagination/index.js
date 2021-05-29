
const container = document.querySelector('.container');
// store last document
let latestDoc = null;

const getNextReviews = async () => {
    const ref = db.collection('reviews')
    .orderBy('createdAt')
    .startAfter(latestDoc || 0)
    .limit(3)
    const data = await ref.get();

    // output doc
    let template = ''
    data.docs.forEach(doc => {
        const review = doc.data();
        
        template += `
        <div class="card" >
            <h2>${review.title}</h2>
            <p>written by ${review.author}</p>
            <p>Rating - ${review.rating} /5 </p>


        </div>
        
        `
    })

    container.innerHTML += template;
    // till here data fetching


    // update latest doc
    latestDoc =  data.docs[data.docs.length -1 ]

    // unattach event if there is no more docs
    if(data.empty){
        loadmore.removeEventListener('click', handleClick);
        container.removeEventListener('scroll', handlescroll)
    }
}

// wait for DOM content to load
window.addEventListener('DOMContentLoaded', () => getNextReviews());

const loadmore = document.querySelector('.load-more button')

const handleClick = () => {
    getNextReviews()
}

loadmore.addEventListener('click',handleClick)

//load more deleteObjectStore
const handlescroll = () =>{
    let triggerHeight = container.scrollTop + container.offsetHeight;
    if(triggerHeight >= container.scrollHeight){
        getNextReviews()
    }
}


container.addEventListener('scroll',handlescroll)