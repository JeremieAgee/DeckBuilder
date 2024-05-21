// Get references to the main elements
let main = document.querySelector("main");

// Constants for button elements
const indexBtn = document.querySelector("#homePgBtn");
const deckBuilderPgBtn = document.querySelector("#deckBuilderPgBtn");
const collectionPgBtn = document.querySelector("#collectionPgBtn");
const deckTesterPgBtn = document.querySelector("#deckTesterPgBtn");

// Constants for colors and card types
const colors = ["c", "g", "r", "b", "u", "w"];
const formats = ["standard", "modern", "pauper", "legacy", "commander"];
const cardTypes = ["instant", "sorcery", "enchantment", "creature", "land", "artifact"];
const scryfallUrl = "https://api.scryfall.com/";

// Global objects for decks and collection
let decks = [];
let collection = [];
let deck = { name: "DeckName", deckCards: [] };
let currentSearchCards = [];
let allSearchCards = [];
let cardNames = [];
let page = 1;
let pages = 1;

// Set the initial home page content
function setHome() {
  main.innerHTML = `<center>
    <img id="homeImg" src="./imgs/starryai_yvnvs.png"/>
    </center>
    <p>Welcome to the Magic the Gathering deck building/testing website.
    This site allows you to build and test decks, save and post your creations.
    Sign up to save decks, post decks, or use the Collection page. Have fun!</p>
  `;
  console.log("Home page set");
}

// Initial call to set the home page
setHome();
// Deck builder page context
const filters = `
  <button type="button" id="showFilters">Filters</button>
  <div id="cardFilters">
    <label for="search">Name/Ability</label>
    <input type="text" id="search">
    <button id="searchBtn" type="button">Search</button>
    <button type="button" id="colorsBtn">Color</button>
    <div id="colors">
      ${colors
				.map(
					(color) => `
        <label for="${color}">
          <img id="${color}" class="cardSymbols" src="">
        </label>
        <input type="checkbox" name="color" id="${color}">
      `
				)
				.join("")}
      <label for="exclusive">Exclusive</label>
      <input type="checkbox" name="color" id="exclusive">
    </div>
    <button type="button" id="typesBtn">Types</button>
    <div id="types">
      ${cardTypes
				.map(
					(type) => `
        <label for="${type}">${type}</label>
        <input type="checkbox" name="type" id="${type}">
      `
				)
				.join("")}
    </div>
    <label for="cmc">CMC</label>
    <input type="number" id="cmc" name="cmc" min="0" max="16">
    <label for="power">Power</label>
    <input type="number" id="power" name="power" min="0" max="20">
    <label for="toughness">Toughness</label>
    <input type="number" id="toughness" name="toughness" min="0" max="20">
    
  <button type="button" id="formatsBtn">Format</button>
  <div id="format">
  ${formats
		.map(
			(type) => `
        <label for="${type}">${type}</label>
        <input type="checkbox" name="format" id="${type}">
      `
		)
		.join("")}
  </div>
  <button type="button" id="filterBtn">Filter</button>
  </div>
  <div id="cards"></div>
`;

const deckBuilderPg = `
  <div id="deck">
    <label for="deckName">Deck Name</label>
    <input type="text" id="deckName">
    <table id ="cardsInDeck">
	<tbody>
	</tbody>
	</table>
    <button type="button" id="saveDeck">Save</button>
  </div>
  ${filters}
`;

// Set the deck builder page content
async function setDeckBuilderPage() {
	main.innerHTML = deckBuilderPg;
	console.log("Deck builder page set");
	
	// Fetch and display mana symbols
	let symbolsList = await fetch(scryfallUrl + "symbology").then((res) =>
		res.json()
	);
	for (let i = 0; i < colors.length; i++) {
		document.querySelector(`#${colors[i]}`).src =
			symbolsList.data[73 - i].svg_uri;
	}

	// Toggle visibility of filters
	document.querySelector("#showFilters").addEventListener("click", () => {
		let filtersDiv = document.querySelector("#cardFilters");
		filtersDiv.style.opacity = filtersDiv.style.opacity == 0 ? 1 : 0;
	});
	document.querySelector("#colorsBtn").addEventListener("click", () => {
		let colorsDiv = document.querySelector("#colors");
		colorsDiv.style.opacity = colorsDiv.style.opacity == 0 ? 1 : 0;
	});

	document.querySelector("#typesBtn").addEventListener("click", () => {
		let typesDiv = document.querySelector("#types");
		typesDiv.style.opacity = typesDiv.style.opacity == 0 ? 1 : 0;
	});

	document.querySelector("#formatsBtn").addEventListener("click", () => {
		let formatsDiv = document.querySelector("#format");
		formatsDiv.style.opacity = formatsDiv.style.opacity == 0 ? 1 : 0;
	});

	// Set up search and filter buttons
	document.querySelector("#saveDeck").addEventListener("click", saveDeck);
	document.querySelector("#searchBtn").addEventListener("click", getCardByName);
	document.querySelector("#filterBtn").addEventListener("click", filterCards);
}

// Get card by name
async function getCardByName() {
	let name = document.querySelector("#search").value;
	if (!name.trim()) return;

	let card = {};

	for (let cardName of cardNames) {
		if (cardName.toLowerCase().startsWith(name.toLowerCase())) {
			let response = await fetch(scryfallUrl + "cards/named?fuzzy=" + name);
			card = await response.json();
			console.log(card);

			break;
		}
	}

	let cardsDiv = document.querySelector("#cards");
	cardsDiv.innerHTML = `<img id="${card.name}" src="${card.image_uris.small}">`;
	let img = document.querySelector("#" + card.name);
	img.addEventListener("dblclick", () => {
		addToDeck(card);
	});
	
	document.querySelector("#search").value = "";
}

// Fetch card names
async function getCardNames() {
	const response = await fetch(scryfallUrl + "catalog/card-names");
	const data = await response.json();
	cardNames = data.data;
}
getCardNames();

// Get a random card
async function getRandomCard() {
	try {
		const response = await fetch(scryfallUrl + "cards/random");
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

// Set the deck tester page content
async function setDeckTesterPage() {
	main.innerHTML = `
    <div id="deckSelection"></div>
    <div id="deck"></div>
    <div id="graveyard"></div>
    <div id="exile"></div>
    <div id="hand"></div>
    <div id="field"></div>
    <div id="life"></div>
  `;
	console.log("Deck tester page set");
}

// Set the collection page content
async function setCollectionPage() {
  main.innerHTML = `
    <div id="collectionPage">
      <button type="button" id="toggleCollectionBtn">Show/Hide Collection</button>
      <div id="collection" style="display: none;"></div>
      ${filters}
    </div>
  `;
  console.log("Collection page set");

  // Fetch and display mana symbols
  let symbolsList = await fetch(scryfallUrl + "symbology").then((res) =>
    res.json()
  );
  for (let i = 0; i < colors.length; i++) {
    document.querySelector(`#${colors[i]}`).src =
      symbolsList.data[73 - i].svg_uri;
  }

  // Toggle visibility of filters
  document.querySelector("#showFilters").addEventListener("click", () => {
    let filtersDiv = document.querySelector("#cardFilters");
    filtersDiv.style.opacity = filtersDiv.style.opacity == 0 ? 1 : 0;
  });
  document.querySelector("#colorsBtn").addEventListener("click", () => {
    let colorsDiv = document.querySelector("#colors");
    colorsDiv.style.opacity = colorsDiv.style.opacity == 0 ? 1 : 0;
  });

  document.querySelector("#typesBtn").addEventListener("click", () => {
    let typesDiv = document.querySelector("#types");
    typesDiv.style.opacity = typesDiv.style.opacity == 0 ? 1 : 0;
  });

  document.querySelector("#formatsBtn").addEventListener("click", () => {
    let formatsDiv = document.querySelector("#format");
    formatsDiv.style.opacity = formatsDiv.style.opacity == 0 ? 1 : 0;
  });

  // Set up search and filter buttons
  document.querySelector("#searchBtn").addEventListener("click", getCardByName);
  document.querySelector("#filterBtn").addEventListener("click", filterCards);

  // Toggle visibility of collection
  document.querySelector("#toggleCollectionBtn").addEventListener("click", () => {
    let collectionDiv = document.querySelector("#collection");
    collectionDiv.style.display = collectionDiv.style.display == "none" ? "block" : "none";
    if (collectionDiv.style.display == "block") {
      displayCollection();
    }
  });
}

// Function to display the collection
function displayCollection() {
  let collectionDiv = document.querySelector("#collection");
  collectionDiv.innerHTML = "";
  collection.forEach((card) => {
    let cardDiv = document.createElement("div");
    cardDiv.className = "cardInCollection";
    cardDiv.innerHTML = `
      <img src="${card.image_uris.small}" alt="${card.name}">
      <p>${card.name} (${card.count})</p>
    `;
    collectionDiv.appendChild(cardDiv);
  });
}

// Add a card to the collection
function addToCollection(card) {
  let existingCard = collection.find((c) => c.name === card.name);
  if (existingCard) {
    existingCard.count++;
  } else {
    collection.push({ ...card, count: 1 });
  }
  displayCollection();
}

// Remove a card from the collection
function removeFromCollection(card) {
  let existingCard = collection.find((c) => c.name === card.name);
  if (existingCard && existingCard.count > 0) {
    existingCard.count--;
    if (existingCard.count === 0) {
      collection = collection.filter((c) => c.name !== card.name);
    }
  }
  displayCollection();
}
// Function to add a card to the deck
function addToDeck(card) {
	// Count the occurrences of the card in the deck
	let cardCounts = deck.deckCards.reduce((counts, c) => {
		counts[c.name] = (counts[c.name] || 0) + 1;
		return counts;
	}, {});
	maxCount = 4;
	if (card.type_line.split(" ")[0] == "Basic") {
		maxCount = 100;
	}
	// Check if the card count is less than 4 before adding
	if (!cardCounts[card.name] || cardCounts[card.name] < maxCount) {
		deck.deckCards.push(card);

		// Update the table with the cards in the deck
		updateDeckTable();
	} else {
		console.log(`Cannot add more than 4 copies of ${card.name}`);
	}
}

// Function to update the deck table
function updateDeckTable() {
	// Get the table body where cards will be displayed
	let cardsInDeck = document.querySelector("#cardsInDeck tbody");

	// Clear the current table contents
	cardsInDeck.innerHTML = "";

	// Count the occurrences of each card
	let cardCounts = deck.deckCards.reduce((counts, card) => {
		counts[card.name] = (counts[card.name] || 0) + 1;
		return counts;
	}, {});

	// Add each unique card to the table with its count
	for (let cardName in cardCounts) {
		let row = document.createElement("tr");
		let nameCell = document.createElement("td");
		let countCell = document.createElement("td");

		nameCell.textContent = cardName;
		countCell.textContent = cardCounts[cardName];

		row.appendChild(nameCell);
		row.appendChild(countCell);
		cardsInDeck.appendChild(row);
	}
}
// Function to set the cards in the div and attach the onclick event
function setCardsDiv(arr) {
	let cardsDiv = document.querySelector("#cards");
	cardsDiv.innerHTML = "";

	let start = (page - 1) * 25;
	let end = Math.min(start + 25, arr.length);

	for (let i = start; i < end; i++) {
		if (arr[i].image_uris && arr[i].image_uris.small) {
			let cardImg = document.createElement("img");
			cardImg.className = "cardSearch";
			cardImg.id = `${arr[i].name}${i}`;
			cardImg.src = arr[i].image_uris.small;
			cardImg.addEventListener("dblclick", () => addToDeck(arr[i]));
			cardsDiv.appendChild(cardImg);
		}
	}

	let paginationDiv = document.createElement("div");
	paginationDiv.id = "pagination";
	for (let i = 0; i < pages; i++) {
		let pageBtn = document.createElement("button");
		pageBtn.type = "button";
		pageBtn.className = "pageBtns";
		pageBtn.id = `page${i + 1}`;
		pageBtn.textContent = i + 1;
		pageBtn.onclick = () => {
			page = i + 1;
			setCardsDiv(currentSearchCards);
		};
		paginationDiv.appendChild(pageBtn);
	}
	cardsDiv.appendChild(paginationDiv);
}
// Fetch all card pages
async function fetchAllCardPages(url) {
	let cards = [];
	let nextPageUrl = url;

	while (nextPageUrl) {
		const response = await fetch(nextPageUrl);
		const data = await response.json();
		cards = cards.concat(data.data);
		nextPageUrl = data.next_page;
	}

	return cards;
}

// Filter cards and update the card display
async function filterCards() {
	let searchUrl = scryfallUrl + "cards/search?q=";
	let filterParts = [];

	let cmc = document.querySelector("#cmc").value;
	let power = document.querySelector("#power").value;
	let toughness = document.querySelector("#toughness").value;

	let checkedColorBoxes = document.querySelectorAll(
		'input[name="color"]:checked'
	);
	let checkedTypeBoxes = document.querySelectorAll(
		'input[name="type"]:checked'
	);
	let checkedFormatBoxes = document.querySelectorAll(
		'input[name="format"]:checked'
	);

	if (checkedTypeBoxes.length > 0) {
		let typeFilter = Array.from(checkedTypeBoxes)
			.map((type) => `type%3A${type.id}`)
			.join("+");
		filterParts.push(typeFilter);
	}

	if (checkedColorBoxes.length > 0) {
		let colorFilter =
			"color%3D" +
			Array.from(checkedColorBoxes)
				.map((color) => color.id.toUpperCase())
				.join("");
		filterParts.push(colorFilter);
	}

	if (checkedFormatBoxes.length > 0) {
		let formatFilter = Array.from(checkedFormatBoxes)
			.map((format) => `format%3A${format.id}`)
			.join("+");
		filterParts.push(formatFilter);
	}

	if (cmc) filterParts.push(`cmc%3D${cmc}`);
	if (power) filterParts.push(`pow%3D${power}`);
	if (toughness) filterParts.push(`tou%3D${toughness}`);

	// Only proceed if there's at least one filter part
	if (filterParts.length === 0) return;

	searchUrl += filterParts.join("+");

	try {
		currentSearchCards = await fetchAllCardPages(searchUrl);
		allSearchCards = [...currentSearchCards];
		pages = Math.ceil(currentSearchCards.length / 25);
		setCardsDiv(currentSearchCards);
		setPageBtns();

		// Reset filters
		document
			.querySelectorAll('#cardFilters input[type="checkbox"]')
			.forEach((checkbox) => (checkbox.checked = false));
		document
			.querySelectorAll('#cardFilters input[type="number"]')
			.forEach((input) => (input.value = ""));
		document.querySelector("#search").value = "";
	} catch (error) {
		console.error("Error fetching filtered cards:", error);
	}
}

// Function to set page buttons
function setPageBtns() {
	let pageBtns = document.querySelectorAll(".pageBtns");
	pageBtns.forEach((button) => {
		button.onclick = function () {
			page = parseInt(button.id.replace("page", ""));
			setCardsDiv(currentSearchCards);
		};
	});
}

// Shuffle the deck
function shuffleDeck(deck) {
	for (let i = deck.deckCards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck.deckCards[i], deck.deckCards[j]] = [
			deck.deckCards[j],
			deck.deckCards[i],
		];
	}
	return deck;
}
// Save the current deck
function saveDeck() {
    let deckName = document.querySelector("#deckName").value.trim();
    if (!deckName) {
      alert("Please enter a deck name.");
      return;
    }

    let newDeck = {
      name: deckName,
      cards: deck.deckCards
    };

    decks.push(newDeck);
    deck = { name: "", deckCards: [] };
    displayDeck();
    console.log("Deck saved:", newDeck);
	localStorage.setItem("decksJson", decks);
  }

function getDecks(){
	let storedDecks = JSON.parse(localStorage.getItem("decksJSON"));
	decks = storedDecks;
	deck = storedDecks[0];
}

// Set event listeners for navigation buttons
indexBtn.addEventListener("click", setHome);
deckBuilderPgBtn.addEventListener("click", setDeckBuilderPage);

collectionPgBtn.addEventListener("click", setCollectionPage);
deckTesterPgBtn.addEventListener("click", setDeckTesterPage);

console.log("Event listeners set for all navigation buttons");
