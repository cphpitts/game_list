
function loadLists() {
	console.log("Running Load Lists");
	var query = document.location.search.substring(1); // Remove leading '?'
			console.log("Query: " + query);
			var query = query.replace('?', '&');
			var params = query.split('&');

			// Get 'users' from the request parameters
			for (var i = 0; i < params.length; i++) {
			   var key = params[i].split('=')[0];
			   if (key === 'users') {
				  var userNames = params[i].split('=')[1];
				  break;
			   }
			}

			userList = new Array();
			if (userNames != null) {
				userList = userNames.split(',');
			}
			console.log(userList);

			///////////////////////////////////

			//var userList = new Array("cphpitts", "whitten", "GCPDblue");
			userNumber = userList.length;

			req = new Array();

			for (i=0; i<userNumber; i++) {
				userCollection = "https://www.boardgamegeek.com/xmlapi2/collection?username=" + userList[i] + "&own=1&subtype=boardgame&excludesubtype=boardgameexpansion";
				req[i] = new XMLHttpRequest();
				req[i].open("GET", userCollection, false);
				req[i].send(null);
				console.log(req[i].responseCode);
			}

			console.log(userNumber);
			if (userNumber == 0) {
				console.log("b");
				userList[0] = "";
			}

			if (userNumber > 0) {
				createCollection();
			} else {
				userNumber = 1;
			}

			populateUsers();
}

function createCollection () {
			var parser, xmlDoc;

			var userOrig = new Array();
			var userDoc = new Array();
			parser = new DOMParser();

			for (i=0; i < userNumber; i++) {
				userOrig[i] = req[i].responseText;
				userDoc[i] = parser.parseFromString(userOrig[i], "text/xml");

			}

			console.log(userDoc[0]);

			//Get length and game titles from user lists
			var gameList = [];
			var totalLength = gameList.length;
			var currentLength = 0;

			for (i=0; i < userNumber; i++) {
				totalLength = gameList.length;
				currentLength = userDoc[i].getElementsByTagName("item").length;
				var items = userDoc[i].getElementsByTagName("item");
				for (j=0; j<currentLength; j++) {
					gameList[totalLength + j] = new Array (items[j].getElementsByTagName('name')[0].innerHTML, items[j].getElementsByTagName('thumbnail')[0].innerHTML, userList[i]);
					//gameList[i][0] = items[i].getElementsByTagName('name')[0].innerHTML;
					//gameList[i][1] = items[i].getElementsByTagName('image')[0].innerHTML;
				}
			}

			// Sort list
			gameList.sort();

			//Populate Page
			currentLength = gameList.length;
			var mainDiv = document.getElementById("gameNames");
			for (i=0; i<currentLength; i++) {
				// Compare current item to next item for dupliacates
				if (i+1 == currentLength || gameList[i][0] != gameList[i+1][0]) {
					var gameContainer = document.createElement("div");
					gameContainer.className = "gameContainer";
					mainDiv.appendChild(gameContainer);

					// Style every other rows
					if (i % 2 == 0) {
						gameContainer.className += " gameEven";
					}

					// Make image div and attach to main div
					var gameImage = document.createElement("div");
					gameContainer.appendChild(gameImage);
					gameImage.innerHTML = '<img src="' + gameList[i][1] + '">';

					var gameText = document.createElement("div");
					gameText.className = "gameText";
					gameContainer.appendChild(gameText);

					// Game Name
					var gameName = document.createElement("div");
					gameName.className = "gameName";
					gameText.appendChild(gameName);
					gameName.innerHTML = gameList[i][0];

					// Game Owner
					var gameOwner = document.createElement("div");
					gameOwner.className = "gameOwner";
					gameOwner.innerHTML = gameList[i][2];
					gameText.appendChild(gameOwner);

					// Min/Max Players
					var minPlayers = null;

				} else {
					gameList[i+1][2] += ' ' + gameList[i][2];
				}
			}
		}

		// List of Users
		function populateUsers () {
			console.log("userList");
			console.log(userList);
			console.log(userNumber);
			var userNameList = document.querySelector("#userNamesContainer > form");

			for (i=0; i<userNumber; i++) {
				var userForm = document.createElement("input");
				userForm.value = userList[i];
				userNameList.appendChild(userForm);
			}
		}

		function addUser() {
			var userForm = document.querySelector("#userNamesContainer form");
			var emptyUser = document.createElement("input");
			userForm.appendChild(emptyUser);
		}

		function resetPage() {
			var activeUsers = document.querySelectorAll("#userNamesContainer input");
			var activeValue = new Array;
			var j = 0;
			for (i=0; i<activeUsers.length; i++) {
				console.log(activeUsers[i].value.length);
				if (activeUsers[i].value.length > 0) {
					activeValue[j] = activeUsers[i].value;
					j++;
				}
			}
			console.log(activeValue);

			console.log(activeUsers);
			var newList = activeValue.join();
			console.log(newList);
			var url = window.location.href;
			if (url.indexOf('?') > -1){
			   url = window.location.href.split('?')[0];
			   url += '?users=' + newList;
			} else {
			url += '?users=' + newList;
			}
			console.log(url);
			window.location.href = url;
		}
