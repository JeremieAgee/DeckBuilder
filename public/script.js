// Added the main element of the page that will be updated based on page call
let main = document.querySelector("main");
//Added all constant variables that never change
const indexBtn = document.querySelector("#homePgBtn");
const deckBuilderPgBtn = document.querySelector("#deckBuilderPgBtn");
const deckSearchPgBtn = document.querySelector("#deckSearchPgBtn");
const collectionPgBtn = document.querySelector("#collectionPgBtn");
const loginPgBtn = document.querySelector("#loginPgBtn");
const signupPgBtn = document.querySelector("#signupPgBtn");
const deckTesterPgBtn = document.querySelector("#deckTesterPgBtn");
const colors = ["colorless", "green", "red", "black", "blue", "white"];
const scryfallUrl = "https://api.scryfall.com/";
//Decks object where key will be deck name and value will be a deck object
let decks = {
	//array of deck objects
	decks: [],
};
//Collection object
let collection = {
	//array of card objects that have a count
	cards: [],
};
// Deck object
let deck = {
	name: "DeckName",
	//array of card objects.
	cards: [],
};
// Card object will have a count key when in collection
let card = {};
let cardNames = []; //Array of card names
// Holds the deck builder page context.

let filters = `
<button type="button" id="showFilters">Filters</button>
<div id="cardFilters">
<label for ="search">Name/Ability</label>
<input type="text" id ="search">
<button id="searchBtn" type="button">Search</button>
<button type="button" id="colorsBtn">Color</button>
<div id="colors">
<label for ="w" ><img id="white" class="cardSymbols" src=""></label>
<input type ="checkbox" name="color" id ="w">
<label for ="g" ><img id="green" class="cardSymbols" src=""></label>
<input type ="checkbox" name="color" id ="g">
<label for ="u" ><img id="blue" class="cardSymbols" src=""></label>
<input type ="checkbox" name="color" id ="u">
<label for ="colorless" ><img id="colorless" class="cardSymbols" src=""></label>
<input type ="checkbox" name="color" id ="colorless">
<label for ="r" ><img id="red" class="cardSymbols" src=""></label>
<input type ="checkbox" name="color" id ="r">
<label for ="b" ><img id="black" class="cardSymbols" src=""></label>
<input type ="checkbox" id ="b">
<label for ="exclusive" >Exclusive</label>
<input type ="checkbox" name="color" id ="exclusive">
</div>
<button type="button" id="typesBtn">Types</button>
<div id="types">
<label for ="instant">Instant<label>
<input type ="checkbox" id ="instant">
<label for ="sorcery">Sorcery<label>
<input type ="checkbox" id ="sorcery">
<label for ="enchantment">Enchantment<label>
<input type ="checkbox" id ="enchantment">
<label for ="creature">Creature<label>
<input type ="checkbox" id ="creature">
<label for ="planeswalker">Planeswalker<label>
<input type ="checkbox" id ="planeswalker">
<label for ="land">Land<label>
<input type ="checkbox" id ="land">
<label for ="artifact">Artifact<label>
<input type ="checkbox" id ="artifact">
</div>
<label for ="cmc">Cmc</label>
<input type ="number" id ="cmc" name="cmc" min=0 max=16>
<label for ="power">Power</label>
<input type ="number" id ="power" name="power" min=0 max=20>
<label for ="toughness">Toughness</label>
<input type ="number" id ="toughness" name="toughness" min=0 max=20>
<button type= "button" id="filterBtn">Filter</button>
</div>
<div id="cards">

</div>`;
let deckBuilderPg =
	`<div id="deck">
<label for ="deckName">DeckName</label>
<input type ="text" id="deckName"/>
<p>1x Card name</p>
<button type="button" id="saveDeck">Save</button>
</div>` + filters;
function setHome() {
	main.innerHTML = `<p>Here I have made a personal Magic the gathering deck building/testing website.
        This site is meant for anyone to try new decks or post decks that you make.
        If you want to save decks, post decks or use the Collection page you must signup Thank You!
        Have fun.</p>`;
}
setHome();
async function setDeckBuilderPage() {
	main.innerHTML = deckBuilderPg;
	let symbolsList = await fetch(scryfallUrl + "symbology").then((res) =>
		res.json()
	);

	for (let i = 0; i < 6; i++) {
		let value = 73 - i;
		document.querySelector("#" + colors[i]).src =
			symbolsList.data[value].svg_uri;
	}

	document.querySelector("#colorsBtn").onclick = function () {
		let colorsDiv = document.querySelector("#colors");

		if (colorsDiv.style.opacity == 0) {
			colorsDiv.style.opacity = 10;
		} else if (colorsDiv.style.opacity == 10) {
			colorsDiv.style.opacity = 0;
		}
	};
	document.querySelector("#typesBtn").onclick = function () {
		let typesDiv = document.querySelector("#types");
		if (typesDiv.style.opacity == 0) {
			typesDiv.style.opacity = 10;
		} else if (typesDiv.style.opacity == 10) {
			typesDiv.style.opacity = 0;
		}
	};
	let searchBtn = document.querySelector("#searchBtn");
	searchBtn.onclick = getCardByName;
	let filterBtn = document.querySelector("#filterBtn");
	filterBtn.onclick = filterCards;
	async function filterCards() {
		let searchUrl = "cards/search?q=c%3Dr+mv%3D1";
		let response = await fetch(scryfallUrl + searchUrl);
		let data = await response.json();
		let cards = data.data;
		console.log(data);
		console.log(cards);
		let cardsDiv = document.querySelector("#cards");
		let pages = data.total_cards/25;
		let page = 1;
		for (let i = 0; i < pages - 1; i++) {
			for (let j = 0; j < 25; j++) {
				if(i==0&&j==0){
					cardsDiv.innerHTML = ``;
				}
				if (page > 1) {
					let track = 25 * page + j;
					cardsDiv.innerHTML += `<img class="cardSearch"src="${cards[track].image_uris.small}"/>`;
				} else if (i == 0) {
					cardsDiv.innerHTML += `<img class="cardSearch"src="${cards[j].image_uris.small}"/>`;
				}
			}
			cardsDiv.innerHTML += `<button type="button" id="page${i + 1}">${
				i + 1
			}</button>`;
		}
	};
}
async function getCardByName() {
	let name = document.querySelector("#search").value;
	card = {
		"name": "",
		"img_uri": "",
		"count": 0

	};
	for (let i = 0; i < cardNames.length; i++) {
		let cardName = cardNames[i].slice(0, name.length);
		if (name.toLocaleLowerCase() === cardName.toLocaleLowerCase()) {
			let response = await fetch(scryfallUrl + "cards/named?fuzzy=" + name);
			let data = await response.json();
			card.name = data.name;
			card.img_uri = data.image_uris.small;
		}
	}
	let imgTag = `<img id ="${card.name}"src="${card.img_uri}" onclick="addToDeck()">`;
	
	let cardsDiv = document.querySelector("#cards");
	cardsDiv.innerHTML = imgTag;
	document.querySelector("#search").value = "";
}
async function getCardNames() {
	const response = await fetch(scryfallUrl + "catalog/card-names");
	const data = await response.json();
	cardNames = data.data;
}
getCardNames();
async function setCollectionPage() {}
function setLoginPage() {
	main.innerHTML = `<div id="loginFormDiv">
    <form action="loginForm" id="loginForm">
    <label for="username">Username:</label>
    <input type="text" name="username" required>
    <label for="password">Password:</label>
    <input type="password" name="password"  min=5 required>
    <button type="submit">Login</button>
    </form>
    </div>`;
	document
		.getElementById("loginForm")
		.addEventListener("submit", async (event) => {
			event.preventDefault(); // Prevent the default form submission
			const username = loginForm.username.value;
			const password = loginForm.password.value;
			const user = {
				username: username,
				password: password,
			};
			console.log(user);
			try {
				const response = await fetch("/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(user),
				});
			} catch (error) {
				console.error("Error:", error);
			}
		});
}
async function getRandomCard() {
	try {
		let url = scryfallUrl + "cards/random";
		const response = await fetch(url);
		const data = await response.json();
		console.log(data); // Access data.name directly
		return data; // Return the data for further processing
	} catch (error) {
		console.error(error);
		return null;
	}
}

function setSignupPage() {
	main.innerHTML = `<div id="signupFormDiv">
    <form action="signupForm" id="signupForm">
    <label for="username">Username:</label>
    <input type="text" name="username" required>
    <label for="password">Password:</label>
    <input type="password" name="password"  min=5 required>
    <label for="email">Email:</label>
    <input type="email" name="email" required>
    <button type="submit">Signup</button>
    </form>
    </div>`;
	document
		.getElementById("signupForm")
		.addEventListener("submit", async (event) => {
			event.preventDefault(); // Prevent the default form submission
			const username = signupForm.username.value;
			const password = signupForm.password.value;
			const email = signupForm.email.value;
			const user = {
				username: username,
				password: password,
				email: email,
			};
			console.log(user);
			try {
				const response = await fetch("/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(user),
				});
			} catch (error) {
				console.error("Error:", error);
			}
		});
}
async function setDeckTesterPage() {
	main.innerHTML = `<div id="deckSelection"></div>
    <div id="deck"></div>
    <div id="graveyard"></div>
    <div id="exile"></div>
    <div id="hand"></div>
    <div id="field"></div>
    <div id="life"></div>`;
}
function addToCollection(card) {
	for (let i = 0; i < collection.cards.length; i++) {
		if ((collection.cards[i].name = card.name)) {
			collection.cards[i].count += 1;
		} else if ((i = collection.cards.length - 1)) {
			collection.cards.push(card);
		}
	}
}
async function removeFromCollection(card) {
	for (let i = 0; i < collection.cards.length; i++) {
		if ((collection.cards[i].name = card.name)) {
			collection.cards[i].count -= 1;
		} else if ((i = collection.cards.length - 1)) {
			collection.cards.push(card);
		}
	}
}
async function filterCards(filters) {
	let checkboxes = document.querySelectorAll('input[name="color"]:checked');
}
function addToDeck() {
	deck.cards.push(card);
	console.log(deck.cards);
}
function removeFromDeck(card) {
	let cardName = card.name;
	for (let i = 0; i < deck.cards.length; i++) {
		if (deck.cards[i].name == cardName) {
			deck.cards[i] = deck.cards[deck.cards.length - 1];
			deck.cards.pop();
			return deck;
		}
	}
}
function shuffleDeck() {
	let index = deck.cards.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (index != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * index);
		index--;

		// And swap it with the current element.
		[deck.cards[index], deck.cards[randomIndex]] = [
			deck.cards[randomIndex],
			deck.cards[index],
		];
	}
}

indexBtn.onclick = setHome;
deckBuilderPgBtn.onclick = setDeckBuilderPage;
collectionPgBtn.onclick = setCollectionPage;
loginPgBtn.onclick = setLoginPage;
signupPgBtn.onclick = setSignupPage;
deckTesterPgBtn.onclick = setDeckTesterPage;
