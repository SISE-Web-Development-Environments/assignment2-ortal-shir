var context;
var shape = new Object();
var character = new Object();
var monster = new Array(1);
var board;
var score;
var start_time;
var time_elapsed;
var interval;
var food_was = new Array();
var board_width = 20;
var board_height = 16;
var walls;
var index_food_was = 0;
var game_over =5;
var more_time;

//initial settings definition
var food_from_user = 50;
var game_time_from_user = 200;
//TODO end game if time ended

//default keys definition
var keyUpCode = 38;
var keyDownCode = 40;
var keyRightCode = 39;
var keyLeftCode = 37;

//initial color definition
var food_color5 = "black";
var food_color15 = "#e66465";
var food_color25 = "#f6b73c";
var wall_color = "grey";
var ghost_color = "blue";
var pac_color = "yellow";
var character_color = "pink";


$(document).ready(function() {
	context = canvas.getContext("2d");
	initiateKeysListener();
	hideGame();
	displaySettings();
});
/*-------------------------------- Start Game------------------------------------ */

//A function that places the objects on the board at the beginning of a game
function Start() {
	createWalls();
	pickColor();
	setSettingsDisplayForUser();
	hideSettings();
	displayGame();
	more_time = 0;
	board = new Array();
	score = 0;
	game_over = 5;
	var cnt = board_height * board_width;
	let food_division = divisionFood(food_from_user)
	var pacman_remain = 1;
	var hourglass = 1;
	start_time = new Date();
	for (var i = 0; i < board_height; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < board_width; j++) {
			if(board[i][j] == 6 || board[i][j] == 7 || board[i][j] == 8 || board[i][j] == 9 ){
				continue;
			}
			else if(i == 0 && j == 0){
				character.i = i;
				character.j = j;
				board[i][j] = 5;
			}
			else if (isAWall(i,j)) {
				board[i][j] = 4;//block
			} else {
				var randomNum = Math.random();
				if(randomNum <= (1.0 * hourglass) / cnt){
					hourglass--;
					board[i][j] = 1;//hourglass
				}
				else if (randomNum <= (1.0 * food_division[0]) / cnt) {
					food_division[0]--;
					board[i][j] = 11;//food 60%
				} else if (randomNum <= (1.0 * food_division[1]) / cnt) {
					food_division[1]--;
					board[i][j] = 12;//food 30%
				} else if (randomNum <= (1.0 * food_division[2]) / cnt) {
					food_division[2]--;
					board[i][j] = 13;//food 10%
				} else if (randomNum < (1.0 * (pacman_remain) / cnt)) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;//pacamne
					board[i][j] = 2;
				} else {
					board[i][j] = 0;//blank
				}
				cnt--;
			}
		}
	}
	if (hourglass > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		hourglass--;
	}
	while (food_division[0] > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 11;
		food_division[0]--;
	}
	while (food_division[1] > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 12;
		food_division[1]--;
	}
	while (food_division[2] > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 13;
		food_division[2]--;
	}
	if (pacman_remain > 0) {
		let emptyCell = findRandomEmptyCell(board);
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 2;
		pacman_remain--;
	}
	initiateKeysListener();
	positinBeginMonster();
	interval = setInterval(UpdatePosition, 100);
}

function initiateKeysListener(){
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
}

//Distribution food function 
function divisionFood(food_remain){
	all_food = food_remain;
	food_60 = Math.floor(food_remain*0.6);
	all_food -= food_60;
	food_30 = Math.floor(food_remain*0.3);
	all_food -= food_30;
	return [food_60,food_30,all_food]	
}
//Function for the location of monsters
function positinBeginMonster(){
	for (let h =0; h < monster.length; h++){
		if(h == 0){
			positionMonster(0,board_height-1, board_width-1,6);
		}else if(h==1){
			positionMonster(1,board_height-1,0,7);
		}else if(h==2){
			positionMonster(2,0, board_width-1,8);
		}else if(h==3){
			positionMonster(3,board_height-1,1,9);
		}
	}
}

//A function that defines the monster's location at the beginning of the game
function positionMonster(number_monster, i, j, index_board){
	monster[number_monster] =  new Object();
	board[i][j] = index_board; 
	monster[number_monster].i = i;
	monster[number_monster].j = j
}

function createWalls(){
	walls = new Array();
	for (i = 0; i < board_height; i++){
		walls [i] = new Array();
	}
	for (j = 0; j < board_width; j++){
		walls [0][j] = 0;
		walls [1][j] = 0;
	}
	walls [2] = [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0];
	walls [3] = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
	walls [4] = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0];
	walls [5] = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
	walls [6] = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
	walls [7] = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
	walls [8] = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
	walls [9] = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
	walls [10]= [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
	walls [11]= [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0];
	walls [12]= [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0];
	walls [13]= [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0];
	walls [14]= [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0];
	for (j = 0; j < board_width; j++){
		walls [15][j] = 0;
	}
}

function isAWall(i, j){
	return walls[i][j] == 1;
}

/*-------------------------------- Help function------------------------------------ */

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * (board_width -1) + 1);
	while (board[i][j] != 0 ) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() *  (board_width -1) + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keyLeftCode]) {
		return 1;
	}
	if (keysDown[keyRightCode]) {
		return 2;
	}
	if (keysDown[keyUpCode]) {
		return 3;
	}
	if (keysDown[keyDownCode]) {
		return 4;
	}
}

function mainSavefood(i, j){
	saveFood(i, j,1);
	saveFood(i, j,11);
	saveFood(i, j,12);
	saveFood(i, j,13);
	saveFood(i, j,6);
	saveFood(i, j,7);
	saveFood(i, j,8);
	saveFood(i, j,9);

}

function saveFood( i, j,number){
	if(j >= 0 && i >=0 && i < board_height && j < board_width && board[i][j] == number){
		food_was[index_food_was] =[i,j,number];
		index_food_was++;
	}
}



//Function that checks whether the figure can be moved to the Left
function checkMoveLeft(object){
	mainSavefood(object.i,object.j-1);
	return object.j > 0 && board[object.i][object.j - 1] != 4;
}

//Function that checks whether the figure can be moved to the Right
function checkMoveRight(object){
	mainSavefood(object.i,object.j+1);
	return object.j  < board_width-1 && board[object.i][object.j + 1] != 4;
}
//Function that checks whether the figure can be moved to the Down
function checkMoveDown(object){
	mainSavefood(object.i-1,object.j);
	return object.i  > 0 && board[object.i - 1][object.j] != 4;

}
//Function that checks whether the figure can be moved to the Up
function checkMoveUp(object){
	mainSavefood(object.i+1,object.j);
	return object.i < board_height-1 && board[object.i + 1][object.j] != 4;

}

//A function that returns the drawing of the food if it was present
function returnFoodWas(){
	for( let i=0 ; i < food_was.length ; i++){
		obj = food_was[i];
		board[obj[0]][obj[1]] = obj[2];
	}
	index_food_was = 0;
	food_was = new Array();
}


/*-------------------------------- Position Monster------------------------------------ */

function mainChangPositionMonster(position_pacman){
	let index = 6
	for(let i=0; i< monster.length; i++){
		board[monster[i].i][monster[i].j] = 0;
		changPositionMonster(i,index,position_pacman);
		index++;
	}
}

function changPositionMonster(index, number_monster,position_pacman){

	if (position_pacman == 1) { //left
		if (monster[index].j > 0 && board[monster[index].i][monster[index].j - 1] != 4) {
			checkMoveLeft(monster[index]);
			monster[index].j--;
		}else{
			if(otherPositin(false,false, true, false,index)  ||
			otherPositin(true,false, false, false,index) ||
			otherPositin(false,true, false, false,index) ||
			otherPositin(false,false, false, true,index)){
				
			}		}
	}
	else if (position_pacman == 2) {//right
		if (monster[index].j  <  board_width-1 && board[monster[index].i][monster[index].j + 1] != 4) {
			checkMoveRight(monster[index]);
			monster[index].j++;
		}else{
			if(otherPositin(false,true, false, false,index) ||
			otherPositin(true,false, false, false,index) ||
			otherPositin(false,false, true, false,index) ||
			otherPositin(false,false, false, true,index)){

			}

		}
	}
	else if (position_pacman == 4) { //down
		if (monster[index].i  > 0 && board[monster[index].i - 1][monster[index].j] != 4) {
			checkMoveDown(monster[index])
			monster[index].i--;
		}else{
			if(otherPositin(false,false, false, true,index) ||
			otherPositin(false,true, false, false,index) ||
			otherPositin(false,false, true, false,index) ||
			otherPositin(true,false, false, false,index)){

			}

		}
	}
	else if (position_pacman == 3) {//up
		if (monster[index].i < board_height-1 && board[monster[index].i + 1][monster[index].j] != 4) {
			checkMoveUp(monster[index]);
			monster[index].i++;
		}else{
			if(otherPositin(false,false, true, false,index) ||
			otherPositin(false,false, false, true,index) ||
			otherPositin(false,true, false, false,index) ||
			otherPositin(true,false, false, false,index) ){

			}

		}
	}else{
		if(otherPositin(false,false, false, true,index)  ||
		otherPositin(true,false, false, false,index)  ||
		otherPositin(false,true, false, false,index)||
		otherPositin(false,false, true, false,index)){

		}
	}

	board[monster[index].i][monster[index].j] = number_monster;
	

}

//A function that looks for a different location for a monster since it cannot do the user's movement
function otherPositin(up, right, dowm, left,index){
	if(up){
		if (monster[index].i < board_height-1 && board[monster[index].i + 1][monster[index].j] != 4) {
			checkMoveUp(monster[index]);
			monster[index].i++;
			return true;
		}
	}
	if(right){
		if (monster[index].j  <  board_width-1 && board[monster[index].i][monster[index].j + 1] != 4) {
			checkMoveRight(monster[index]);
			monster[index].j++;
			return true;
		}
	}
	if(left){
		if (monster[index].j > 0 && board[monster[index].i][monster[index].j - 1] != 4) {
			checkMoveLeft(monster[index]);
			monster[index].j--;
			return true;
		}
	}
	if(dowm){
		if (monster[index].i  > 0 && board[monster[index].i - 1][monster[index].j] != 4) {
			checkMoveDown(monster[index])
			monster[index].i--;
			return true;
		}
	}
	return false;
	
}

//Check if a monster has eaten the pacamn
function MonsterAtePacman(){
	for(let i=0; i< monster.length; i++){
		if (monster[i].i == shape.i && monster[i].j == shape.j){
			score = score - 10;
			return true;
		}	
	}
	return false
}


/*-------------------------------- Position Character------------------------------------ */


//A function that updates the character's location
function changPositionCharacter(){
	let found = false;
	while (found == false){
		let move = Math.floor(Math.random() * Math.floor(4));
		if (move == 0) {
			if (checkMoveLeft(character)) {
				character.j--;
				found = true;
			}
		}else if (move == 1) {
			if (checkMoveRight(character)) {
				character.j++;
				found = true;
			}
		}else if (move == 2) {
			if (checkMoveDown(character)) {
				character.i--;
				found = true;
			}
		} else if (move == 3) {
			if (checkMoveUp(character)) {
				character.i++;
				found = true;
			}
		}
	}
	board[character.i][character.j] = 5;
}

/*-------------------------------- Draw---------------------------------------- */

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < board_height; i++) {
		for (var j = 0; j < board_width; j++) {
			var center = new Object();
			center.y = i * 60 + 30;
			center.x = j * 60 + 30;
			if (board[i][j] == 2) { // pacman
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color;
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black";
				context.fill();
			} else if (board[i][j] == 11) { // 5 points food 
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = food_color5;
				context.fill();
			} else if (board[i][j] == 12) { // 15 points food 
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = food_color15;
				context.fill();
			} else if (board[i][j] == 13) { // 25 points food 
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = food_color25;
				context.fill();
			} else if (board[i][j] == 4) { // wall 
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = wall_color;
				context.fill();
			}else if (board[i][j] == 5) { // bonus character
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = character_color;
				context.fill();
				context.beginPath();
			}else if (board[i][j] == 6 || board[i][j] == 7 || board[i][j] == 8 || board[i][j] == 9) { //ghosts
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = ghost_color; 
				context.fill();
				context.beginPath();
			}else if (board[i][j] == 1) { // hourglass
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "red";
				context.fill();
			}
		}
	}
}
/*-------------------------------- Update Position---------------------------------------- */

function UpdatePosition() {
	let x = GetKeyPressed();
	board[character.i][character.j] = 0;
	returnFoodWas();
	mainChangPositionMonster(x);
	changPositionCharacter();
	board[shape.i][shape.j] = 0;
	//i -x
	//j - y
	if (x == 1) { 
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j  <  board_width-1 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) { 
		if (shape.i  > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < board_height-1 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 11) {
		score += 5;
	}else if(board[shape.i][shape.j] == 12){
		score += 15;
	}else if(board[shape.i][shape.j] == 13){
		score += 25;
	}
	if (board[shape.i][shape.j] == 5) {
		score = score + 50;
	}
	if(MonsterAtePacman()){
		if(game_over == 1){
			game_over --;
			Draw();
			endGame("You lost - Try again");		
			Start();
		}else{
			game_over--;
			window.alert("We believe in you! Keep playing");
			Start();	
		}
	}
	if (board[shape.i][shape.j] == 1) {
		more_time = -30;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = ((currentTime - start_time) / 1000) + more_time;
	if(time_elapsed >= game_time_from_user){
		//time ended
		endGame("You lost - Try again");
	}
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	// TODO change score of character
	if (score >= 100 ) {
		Draw();
		endGame("Game completed");
  	}else {
		Draw();
	}
}

function endGame(msg){
	window.clearInterval(interval);		
	window.alert(msg);
}

/*--------------------------------------- Setting---------------------------------------- */

//color logic

function pickColor() {
	//restart pacman color
	pac_color = "yellow";

	// five points
	fivePoints = document.querySelector("#five_points");
	fivePoints.value = food_color5;	
	fivePoints.addEventListener("change", updateFivePointsColor, false);
	fivePoints.select();

	// fifteen points
	fifteenPoints = document.querySelector("#fifteen_points");
	fifteenPoints.value = food_color15;	
	fifteenPoints.addEventListener("change", updateFifteenPointsColor, false);
	fifteenPoints.select();

	// twenty five points
	twentyfivePoints = document.querySelector("#twentyfive_points");
	twentyfivePoints.value = food_color25;	
	twentyfivePoints.addEventListener("change", updateTwentyFivePointsColor, false);
	twentyfivePoints.select();
  }

function updateFivePointsColor (event){
	food_color5 =  event.target.value;
}

function updateFifteenPointsColor (event){
	food_color15 =  event.target.value;
}

function updateTwentyFivePointsColor (event){
	food_color25 =  event.target.value;
}


//set the settings

function submitSettings(){
	//TODO keyboard
	// random button	
	let submitOK = true;

	//amount of food
	let food_balls_number = document.getElementById("food_balls_number").value;
	if (food_balls_number != "" && (food_balls_number < 50 || food_balls_number > 90)) {
		alert("The amount of food balls must be between 50 and 90");
		submitOK = false;
	}

	//game time
	let game_time = document.getElementById("game_time").value;
	if (game_time != "" && game_time < 60) {
		alert("Game time must be at least 60 seconds");
		submitOK = false;
	}

	if(submitOK){
		// update global parameters
		if(food_balls_number == ""){
			food_from_user = 50; //default
		}
		else{
			food_from_user = Math.floor(food_balls_number); //in case user input is not an int
		}
		if(game_time == ""){
			game_time_from_user = 200; // default
		}
		else{
			game_time_from_user = Math.floor(game_time); //in case user input is not an int
		}
		
		//taking amount of monsterts from user
		let num = document.getElementById("mosterts_number").value.substring(document.getElementById("mosterts_number").value.length-1);
		monster = new Array(parseInt(num));

		//set settings display
		setSettingsDisplayForUser()

		Start() // TODO -> is this here?
	}
}

function oneMonster(){
	document.getElementById("mosterts_number").value = "Amount of Monsters: 1";
}

function twoMonsters(){
	document.getElementById("mosterts_number").value = "Amount of Monsters: 2";
}

function threeMonsters(){
	document.getElementById("mosterts_number").value = "Amount of Monsters: 3";
}

function fourMonsters(){
	document.getElementById("mosterts_number").value = "Amount of Monsters: 4";
}

function setSettingsDisplayForUser(){
	document.getElementById("food_display").innerHTML = food_from_user;
	document.getElementById("time_display").innerHTML = game_time_from_user;
	document.getElementById("monster_display").innerHTML = monster.length;
}

// ----------------------------------- hide and display of divs-----------------------------------------//
function hideGame(){
	document.getElementById("game").style.display = "none";
	document.getElementById("settings_display").style.display = "none";
	document.getElementById("score").style.display = "none";
	document.getElementById("time").style.display = "none";
}

function displayGame() {
	document.getElementById("game").style.display = "block";
	document.getElementById("settings_display").style.display = "block";
	document.getElementById("score").style.display = "block";
	document.getElementById("time").style.display = "block";
}

function hideSettings(){
	document.getElementById("settings").style.display = "none"
}

function displaySettings() {
	document.getElementById("settings").style.display = "block";
}