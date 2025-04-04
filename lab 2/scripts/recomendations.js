let favouriteGames = JSON.parse(localStorage.getItem('favouriteGames')) || [];

const allGames = [
  { title: "Spades", genre: "Puzzle", rating: 4.8, stars: "★★★★★", activePlayers: "1,500", image: "games-images/spades-puzzle.avif"},
  { title: "Block Champ", genre: "Puzzle", rating: 4.7, stars: "★★★★★", activePlayers: "1,200", image: "games-images/block-champ-puzzle.avif"},
  { title: "Words Of Wonders", genre: "Puzzle", rating: 4.2, stars: "★★★★☆", activePlayers: "985", image: "games-images/words-of-wonders-puzzle.avif"},
  { title: "Paper.io", genre: ".io", rating: 4.9, stars: "★★★★★", activePlayers: "5,125", image: "games-images/paper-io.avif"},
  { title: "Agar.io", genre: ".io", rating: 5.0, stars: "★★★★★", activePlayers: "8,254", image: "games-images/agar-io.avif"},
  { title: "Mope.io", genre: ".io", rating: 3.9, stars: "★★★☆☆", activePlayers: "999", image: "games-images/mope-io.avif"},
  { title: "Cross Stitch", genre: "Casual", rating: 4.8, stars: "★★★★★", activePlayers: "4,656", image: "games-images/cross-stitch-casual.avif"},
  { title: "Paper Delivery", genre: "Casual", rating: 3.2, stars: "★★☆☆☆",activePlayers: "2,300", image: "games-images/paper-delivery-casual.avif"},
  { title: "Papa's Donuteria", genre: "Casual", rating: 5.0, stars: "★★★★★", activePlayers: "6,201",image: "games-images/donuteria-casual.avif"
  }
];

function getRandomGamesRecommendations(count) {
  const gamesCopy = [...allGames];
  const recommendations = [];

  let i = 0;
  while (i<count && gamesCopy.length > 0) {
    const randomIdx = Math.floor(Math.random() * gamesCopy.length);
    recommendations.push(gamesCopy[randomIdx]);
    gamesCopy.splice(randomIdx, 1);
    i++;
  }
  return recommendations;
}

function createGameCard(game, allowFavourite = true, isRecommended = false) {
  const isFavorite = favouriteGames.some(favGame => favGame.title === game.title);
  const heartIcon = isFavorite ? "icons/heart-logo.svg" : "icons/heart-duotone.svg";
  const favoriteClass = (isFavorite && !isRecommended) ? "favourite" : "";

  return `
    <div class="game-preview ${favoriteClass}" data-title="${game.title}">
      <div class="thumbnail-row">
        <img class="game-image" src="${game.image}" alt="${game.title}">
        ${allowFavourite ? `
        <button class="favourite-button">
          <img src="${heartIcon}" alt="Add to favourites">
        </button>
        ` : ''}
      </div>
      <div class="game-info">
        <h3 class="game-title">${game.title}</h3>
        <p class="game-genre">Genre: ${game.genre}</p>
        <div class="game-rating">
          <span class="stars">${game.stars}</span>
          <span class="rating-number">${game.rating}</span>
        </div>
        <p class="active-players">
          <img src="icons/active-player-icon.svg" alt="Players">
          <span>${game.activePlayers} active players</span>
        </p>
      </div>
    </div>
  `;
}

function createFavouriteItem(game) {
  return `
    <div class="favourite-item" data-title="${game.title}">
      <img class="favourite-item-image" src="${game.image}" alt="${game.title}">
      
      <div class="favourite-item-info">
        <h3 class="favourite-item-title">${game.title}</h3>
        <p class="favourite-item-genre">Genre: ${game.genre}</p>
        <div class="favourite-item-rating">
          <span class="stars">${game.stars}</span>
          <span class="rating-number">${game.rating}</span>
        </div>
        <p class="favourite-item-players">
          <img src="icons/active-player-icon.svg" alt="Players">
          <span>${game.activePlayers} active players</span>
        </p>
      </div>
      
      <button class="remove-favourite-button">
        <img src="icons/heart-logo.svg" alt="Remove from favourites">
      </button>
    </div>
  `;
}

function generateGamesRecommendations() {
  const recommendations = getRandomGamesRecommendations(4);
  const recContainer = document.getElementById('recommendations-grid');
  
  if (recContainer) {
    recContainer.innerHTML = '';
    recommendations.forEach(game => {
      recContainer.innerHTML += createGameCard(game, false, true); 
    });
  }
}

function displayFavouriteGames() {
  const favsContainer = document.getElementById('favourites-container');
  if (!favsContainer) return;
  
  if (favouriteGames.length === 0) {
    favsContainer.innerHTML = '<p class="no-favourites">You have no favourite games yet. DOUBLE-CLICK the heart icon on games you like</p>';
    return;
  }

  favsContainer.innerHTML = '';
  favouriteGames.forEach(game => {
    favsContainer.innerHTML += createFavouriteItem(game);
  });
  
  addRemoveFavouriteButtonListeners();
}

document.addEventListener('DOMContentLoaded', function() {
  displayFavouriteGames();
  
  const isOnFavouritesPage = window.location.pathname.includes('favourite.html');
  
  if (!isOnFavouritesPage) {
    generateGamesRecommendations();
    const refreshButton = document.getElementById('refresh-recommendations');
    if (refreshButton) {
      refreshButton.addEventListener('click', generateGamesRecommendations);
    }

    addFavouriteButtonListeners();
  }

  allGames.forEach (game => {
    updateGameInstances(game.title, favouriteGames.some(fav => fav.title === game.title));
  });

});

function addFavouriteButtonListeners() {
  const favouriteButtons = document.querySelectorAll('.favourite-button');
  favouriteButtons.forEach(button => {
    button.removeEventListener('dblclick', handleFavButtonClick);
    button.addEventListener('dblclick', handleFavButtonClick);
  });
}

function addRemoveFavouriteButtonListeners() {
  const removeButtons = document.querySelectorAll('.remove-favourite-button');
  
  removeButtons.forEach(button => {
    button.removeEventListener('click', handleRemoveFavourite);
    button.addEventListener('click', handleRemoveFavourite);
  });
}

function handleRemoveFavourite(event) {
  event.preventDefault();
  const favouriteItem = event.currentTarget.closest('.favourite-item');
  const gameTitle = favouriteItem.dataset.title;
  
  //Delete from favorites array
  favouriteGames = favouriteGames.filter(game => game.title !== gameTitle);
  localStorage.setItem('favouriteGames', JSON.stringify(favouriteGames));
  
  //removal with animation
  favouriteItem.style.opacity = '0';
  favouriteItem.style.transform = 'translateX(100px)';
  
  //забираємо з dom після анімації
  setTimeout(() => {
    favouriteItem.remove();

    if (favouriteGames.length === 0) {
      const favsContainer = document.getElementById('favourites-container');
      if (favsContainer) {
        favsContainer.innerHTML = '<p class="no-favourites">You have no favourite games yet. DOUBLE-CLICK the heart icon on games you like</p>';
      }
    }
  }, 300);
}

function handleFavButtonClick(event) {
  event.preventDefault();
  const gameCard = event.currentTarget.closest('.game-preview');
  const gameTitle = gameCard.querySelector('.game-title').textContent;
  
  gameCard.classList.toggle('favourite');
  const buttonImg = event.currentTarget.querySelector('img');
  
  if(gameCard.classList.contains('favourite')) {
    buttonImg.src = 'icons/heart-logo.svg';
    
    const game = allGames.find(g => g.title === gameTitle);
    if (game && !favouriteGames.some(fg => fg.title === gameTitle)) {
      favouriteGames.push(game);
      localStorage.setItem('favouriteGames', JSON.stringify(favouriteGames));
    }
  } else {
    buttonImg.src = 'icons/heart-duotone.svg';
    favouriteGames = favouriteGames.filter(game => game.title !== gameTitle);
    localStorage.setItem('favouriteGames', JSON.stringify(favouriteGames));
  }
  updateGameInstances(gameTitle, gameCard.classList.contains('favourite'));
  displayFavouriteGames();
}

function updateGameInstances(gameTitle, isFavorite) {
  const allGameCards = document.querySelectorAll(`.game-preview[data-title="${gameTitle}"]`);
  
  allGameCards.forEach(card => {
    //Перевіряємо, чи це не рекомендована гра
    const isRecommendedCard = card.closest('#recommendations-grid') !== null;
    
    if(isFavorite && !isRecommendedCard) {
      card.classList.add('favourite');
    }
    else {
      card.classList.remove('favourite');
    }

    const heartImg = card.querySelector('.favourite-button img');
    if (heartImg) {
      heartImg.src = isFavorite ? 'icons/heart-logo.svg' : 'icons/heart-duotone.svg';
    }
  });
}