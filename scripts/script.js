const gameContainer = document.getElementById("gameNames");
var userNameList = [];

function loadLists() {
	console.log("Running Load Lists");
	// console.log(userNameList[0].value)
	userNameList = document.querySelectorAll("#userNamesContainer input");
	if (userNameList[0].value == '') {
		var userList = userQuery();
	} else {
		var userList = userInput();
	}
	// console.log('userList: ' + userList)
	if (userList == undefined) {
		noUsers();
	} else {
		loadCollection(userList);
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
	// console.log(userList)
	return userList;

}

function addUser() {
	var userForm = document.querySelector("#userNamesContainer form");
	var emptyUser = document.createElement("input");
	userForm.appendChild(emptyUser);
}

function loadCollection(users) {
	userNumber = users.length;
	var finalCollectionID = new Array();

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
		var currentListLength = finalCollectionID.length;
		for (j=0; j<userGameLength; j++) {
			finalCollectionID.push(new Object());
			finalCollectionID[currentListLength+j].gameID = userGamesInfo[j].attributes.getNamedItem('objectid').value;
			finalCollectionID[currentListLength+j].gameName = userGamesInfo[j].getElementsByTagName('name')[0].innerHTML;
			finalCollectionID[currentListLength+j].gameImage = userGamesInfo[j].getElementsByTagName('thumbnail')[0].innerHTML;
			finalCollectionID[currentListLength+j].gameOwner = users[i];
		}

		// Sort List
		finalCollectionID.sort(function(a,b){
			var keyA = Number(a.gameName), keyB = Number(b.gameName);
			if (keyA< keyB) return -1;
			if (keyB< keyA) return 1;
			return 0
		});

		//remove Duplicates
		currentListLength = finalCollectionID.length;
		var k = 0;
		console.log(finalCollectionID[k].gameID);
		console.log(finalCollectionID[k+1].gameID);
		while (k+1<currentListLength) {
			if (finalCollectionID[k].gameID === finalCollectionID[k+1].gameID) {
				finalCollectionID[k].gameOwner = finalCollectionID[k].gameOwner + ', ' + finalCollectionID[k+1].gameOwner;
				currentListLength --;
				delete finalCollectionID[k+1];
			} else {
				k++;
			}
		}

	}
	console.log(finalCollectionID);
}
