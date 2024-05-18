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
const colors = ["blue", "white", "red", "green", "black", "colorless"];
//Decks object where key will be deck name and value will be a deck object
let decks = {};
//Collection object where key is card img_uri and value will be count
let collection = {};
// Deck object where key is card img_uri and value is count of card
let deck = {};
//card object where key is card name and value = card img_uri
let card = {};
// Holds the deck builder page context.
let deckBuilderPg = `<div id="deck">
<p>DeckName</p>
<p>1x Card name</p>
</div>
<div id="cardFilters">
<form id ="searchfilter">
<label for ="search">Name/Ability</label>
<input type="text" id ="search">
<input type="submit">
</form>
<form id ="filters">
<button for="color">Color</button>
<div id="colors">
<label for ="u" ><img id="blue" class="cardSymbols" src=""></label>
<input type ="checkbox" id ="u">
<label for ="w" ><img id="white" class="cardSymbols" src=""></label>
<input type ="checkbox" id ="w">
<label for ="r" ><img id="red" class="cardSymbols" src=""></label>
<input type ="checkbox" id ="r">
<label for ="g" ><img id="green" class="cardSymbols" src=""></label>
<input type ="checkbox" id ="g">
<label for ="b" ><img id="black" class="cardSymbols" src=""></label>
<input type ="checkbox" id ="b">
<label for ="b" ><img id="colorless" class="cardSymbols" src=""></label>
<input type ="checkbox" id ="colorless">
</div>
<button id="types">Types</button>
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
<input type= "submit">
</form>
</div>
<div id ="cards">
</div>`;
function setHome() {
	main.innerHTML = `<p>Here I have made a personal Magic the gathering deck building/testing website.
        This site is meant for anyone to try new decks or post decks that you make.
        If you want to save decks, post decks or use the Collection page you must signup Thank You!
        Have fun.</p>`;
}
setHome();
async function setDeckBuilderPage() {
	main.innerHTML = deckBuilderPg;
	let symbolsList = await fetch("https://api.scryfall.com/symbology").then(
		(res) => res.json()
	);

	for (let i = 0; i < 6; i++) {
		let value = 73 - i;
		document.querySelector("#" + colors[i]).src =
			symbolsList.data[value].svg_uri;
	}
}

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
	const loginForm = document.getElementById("loginForm");
	loginForm.addEventListener("submit", async (event) => {
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
		const response = await fetch("https://api.scryfall.com/cards/random");
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
	const signupForm = document.getElementById("signupForm");
	signupForm.addEventListener("submit", async (event) => {
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
async function addToCollection(card) {}
async function removeFromCollection(card) {}
async function filterCards() {}
function addToDeck(card) {
	const newCard = {
		name: card,
	};
}
async function removeFromDeck(card) {}
function setViewDeckPage() {}
function functionShuffleDeck(deck) {}

async function searchCard() {}
indexBtn.onclick = setHome;
deckBuilderPgBtn.onclick = setDeckBuilderPage;
collectionPgBtn.onclick = setCollectionPage;
loginPgBtn.onclick = setLoginPage;
signupPgBtn.onclick = setSignupPage;
deckTesterPgBtn.onclick = setDeckTesterPage;
