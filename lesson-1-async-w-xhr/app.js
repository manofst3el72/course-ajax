(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');
 
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function (err) {
            requestError(err, 'image');
        };
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 073ef0d7a35dfce03c04fcccae92a63f198e2e57792933f977c2c0fba421a197');
        unsplashRequest.send();
 
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'articles');
        };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=c942928367cc459881723ce9de678e26`);
        articleRequest.send();
    });

function addImage() {
    let htmlContent = '';
    const data = JSON.parse(this.responseText);

    if (data && data.results[0]) {
        const firstImage = data.results[0];
        htmlContent = `<figure>
            <img src=${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
    } else {
        htmlContent = '<div class="error-no-image">No images available<.div>';
    }

    responseContainer.insertAdjacentElement('afterbegin', htmlContent);
}

function addArticles() {
    let htmlContent = '';
    const data = JSON.parse(this.responseText);

    if (data.respsone && data.response.docs && data.response.docs.length > 1) {
        htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a><h2>
                <p>$article.snippet}</p>
            </li>`
        ).join('') + '</ul>';
    } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>';
    }

    responseContainer.insertAdjacentElement('beforeend', htmlContent);
}

})