const gameContainer = document.getElementById("gameNames");
var userNameList = [];
var xmltest


function loadLists() {
	console.log("Running Load Lists");	userNameList = document.querySelectorAll("#userNamesContainer input");
	if (userNameList[0].value == '') {
		var userList = userQuery();
	} else {
		var userList = userInput();
	}
	if (userList == undefined) {
		noUsers();
	} else {
		var gameCollection = loadCollection(userList);
		//gameCollection = loadAdditionalInfo(gameCollection);
		populateGameList(gameCollection);
	}
}

function noUsers() {
	gameContainer.innerHTML = "Please Enter a Username and Refresh the List";
}

function userQuery() {

}

function userInput() {
	var userList = [];
	userListLength = userNameList.length;
	for (i=0; i<userListLength; i++) {
		userList[i] = userNameList[i].value;
	}
	return userList;
}

function addUser() {
	var userForm = document.querySelector("#userNamesContainer form");
	var emptyUser = document.createElement("input");
	userForm.appendChild(emptyUser);
}

function loadCollection(users) {
	userNumber = users.length;
	var finalCollection = new Array();

	req = new Array();

	for (i=0; i<userNumber; i++) {
		var userCollection = "https://www.boardgamegeek.com/xmlapi2/collection?username=" + users[i] + "&own=1&subtype=boardgame&excludesubtype=boardgameexpansion";
		req[i] = new XMLHttpRequest();
		req[i].open("GET", userCollection, false);
		req[i].send(null);

		var parser, xmlDoc;

		var userRaw = new Array();
		var userGamesData = new Array();

		parser = new DOMParser();

		userRaw[i] = req[i].responseText;
		userGamesData[i] = parser.parseFromString(userRaw[i], "text/xml");
		var userGameLength = userGamesData[i].getElementsByTagName("item").length;
		var userGamesInfo = userGamesData[i].getElementsByTagName("item");
		var currentListLength = finalCollection.length;
		for (j=0; j<userGameLength; j++) {
			// console.log(j);
			finalCollection.push(new Object());
			finalCollection[currentListLength+j].gameID = userGamesInfo[j].attributes.getNamedItem('objectid').value;
			finalCollection[currentListLength+j].gameName = userGamesInfo[j].getElementsByTagName('name')[0].innerHTML;
			finalCollection[currentListLength+j].gameImage = userGamesInfo[j].getElementsByTagName('thumbnail')[0].innerHTML;
			finalCollection[currentListLength+j].gameOwner = users[i];
		}
	}

	// Sort List
	finalCollection.sort(function(a,b){
		var keyA = a.gameName, keyB = b.gameName;
		if (keyA< keyB) return -1;
		if (keyB< keyA) return 1;
		return -1
	});

	//remove Duplicates
	currentListLength = finalCollection.length;
	var k = 0;
	while (k<currentListLength-1) {
		if (finalCollection[k].gameID === finalCollection[k+1].gameID) {
			finalCollection[k].gameOwner = finalCollection[k].gameOwner + ', ' + finalCollection[k+1].gameOwner;
			currentListLength--;
			finalCollection.splice(k+1,1);
			// delete finalCollection[k+1];
		} else {
			k++;
		}
	}
		console.log(finalCollection);
	return finalCollection;

}

// Load Additional Game Information
function loadAdditionalInfo(gameList) {
	gameNumber = gameList.length;
	var req, gameRaw, gameData;
	for (i=0; i<gameNumber; i++) {
		var gameXML = "https://www.boardgamegeek.com/xmlapi2/thing?id=" + gameList[i].gameID;
		req = new XMLHttpRequest();
		req.open("GET", gameXML, false);
		dataType: "jsonp"
		req.send(null);

		var parser, xmlDoc;

		parser = new DOMParser();

		gameRaw = req.responseText;
		gameData = parser.parseFromString(gameRaw, "text/xml");

		console.log(gameData);
		console.log(gameData.childNodes[0].childNodes[0].getElementsByTagName('minplayers')[0].attributes.value.value);
		xmltest = gameData;
		gameList[i].minPlayer = gameData.childNodes[0].childNodes[0].getElementsByTagName('minplayers')[0].attributes.value.value;
		gameList[i].maxPlayer = gameData.childNodes[0].childNodes[0].getElementsByTagName('maxplayers')[0].attributes.value.value;
	}
	console.log(gameList);
}

//Populate Page
function populateGameList(gameList) {
	currentLength = gameList.length;
	var mainDiv = document.getElementById("gameNames");
	mainDiv.innerHTML = "";
	for (i=0; i<currentLength; i++) {
		var gameContainer = document.createElement("div");
		gameContainer.className = "gameContainer";
		mainDiv.appendChild(gameContainer);
		if (i % 2 == 0) {
			gameContainer.className += " gameEven";
		}
		var gameImage = document.createElement("div");
		gameContainer.appendChild(gameImage);
		gameImage.innerHTML = '<a href="https://www.boardgamegeek.com/boardgame/' + gameList[i].gameID + '">' + '<img src="' + gameList[i].gameImage + '"></a>';

		var gameText = document.createElement("div");
		gameText.className = "gameText";
		gameContainer.appendChild(gameText);

		// Game Name
		var gameName = document.createElement("div");
		gameName.className = "gameName";
		gameText.appendChild(gameName);
		gameName.innerHTML = '<a href="https://www.boardgamegeek.com/boardgame/' + gameList[i].gameID + '">' + gameList[i].gameName + '</a>';

		// Game Owner
		var gameOwner = document.createElement("div");
		gameOwner.className = "gameOwner";
		gameOwner.innerHTML = gameList[i].gameOwner;
		gameText.appendChild(gameOwner);

	}
}
