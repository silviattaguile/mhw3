const simbolo_spotify = document.querySelector('.spotify');

simbolo_spotify.addEventListener('click', clickOnSpotify);


function clickOnSpotify(event) {
    window.open("https://open.spotify.com/artist/715gea5W9B0Wt27UTfOTiJ#login", 'width=600,height=500,left=0,top=0').creator;
    event.preventDefault();
}

const client_id = '9d4373c068a5430db42cd17b952ab6fd';
const client_secret = '1c19b5dfe98645379f2e30c16e37f429';
let token;
const form = document.querySelector('.form');
form.addEventListener('submit', Cerca);

//EVENT LISTENER PER IL SECONDO FORM
const libraryForm = document.querySelector('.form2');
libraryForm.addEventListener('submit', search2)


function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function onJson(json) {
    console.log('JSON ricevuto');
    
    const library = document.querySelector('#album_view');
    library.innerHTML = '';
    
    const results = json.albums.items;
    let num_results = results.length;
    
    if (num_results > 8)
        num_results = 8;
    
    for (let i = 0; i < num_results; i++) {

        
        const lista = results[i]
            
        const titolo = lista.name;
        const selected_image = lista.images[0].url;
        
        const album = document.createElement('div');
        album.classList.add('stile');
        const img = document.createElement('img');
        img.src = selected_image;
        const caption = document.createElement('p');
        const link = document.createElement('a');
        link.setAttribute('href', lista.external_urls.spotify);
        link.textContent = titolo;

        
        album.appendChild(img);
        album.appendChild(caption);
        album.appendChild(link);
        
        library.appendChild(album);

    }
}


function Cerca(event) {
    event.preventDefault();
    const audio = document.querySelector('#album');
    const audio_value = encodeURIComponent(audio.value);
    console.log('Eseguo ricerca: ' + audio_value);
    console.log(audio.value);
    console.log(audio_value);



    //richiesta
    fetch("https://api.spotify.com/v1/search?type=album&q=" + audio_value, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(onResponse).then(onJson);
}

function onTokenJson(json) {
    
    token = json.access_token;
}

function onTokenResponse(response) {
    return response.json();
}

fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: 'grant_type=client_credentials',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    }
}).then(onTokenResponse).then(onTokenJson);






function onJson2(json) {
    console.log('JSON ricevuto');
    
    const library = document.querySelector('#library-view');
    library.innerHTML = '';
    
    let num_results = json.num_found;
    
    if (num_results > 10)
        num_results = 10;
    
    for (let i = 0; i < num_results; i++) {
        
        const doc = json.docs[i]
            
        const title = doc.title;
        
        if (!doc.isbn) {
            console.log('ISBN mancante, salto');
            continue;
        }
        const isbn = doc.isbn[0];
        
        const cover_url = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';
        
        const book = document.createElement('div');
        book.classList.add('book');
        
        const img = document.createElement('img');
        img.src = cover_url;
        
        const caption = document.createElement('span');
        caption.textContent = title;
        
        book.appendChild(img);
        book.appendChild(caption);
        
        library.appendChild(book);
    }
}

function onResponse2(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function search2(event) {
    
    event.preventDefault();
    
    const author_input = document.querySelector('#author');
    const author_value = encodeURIComponent(author_input.value);
    console.log('Eseguo ricerca: ' + author_value);
    
    rest_url = 'http://openlibrary.org/search.json?author=' + author_value;
    console.log('URL: ' + rest_url);
    
    fetch(rest_url).then(onResponse2).then(onJson2);
}