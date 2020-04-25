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
	Start();
});


function Start() {
	createWalls();
	pickColor();
	board = new Array();
	score = 0;
	var cnt = board_height * board_width;
	var food_remain = food_from_user;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < board_height; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < board_width; j++) {
			if(isAMonster(i,j)){
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
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;//food
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
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
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	while (pacman_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 2;
		pacman_remain--;
	}
	for (let h =0; h<monster.length; h++){
		if(h == 0){
			positionMonster(0,15,19,6);
		}else if(h==1){
			positionMonster(1,15,0,7);
		}else if(h==2){
			positionMonster(2,0,19,8);
		}else if(h==3){
			positionMonster(3,15,1,9);
		}

	}
	
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
	interval = setInterval(UpdatePosition, 100);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
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

//A function that defines the monster's location at the beginning of the game
function positionMonster(number_monster, i, j, index_board){
	monster[number_monster] =  new Object();
	board[i][j] = index_board; 
	monster[number_monster].i = i;
	monster[number_monster].j = j
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < board_height; i++) {
		for (var j = 0; j < board_width; j++) {
			var center = new Object();
			center.y = i * 60 + 30;
			center.x = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color;
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black";
				context.fill();
			} else if (board[i][j] == 1) { // 5 points food 
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
			}
		}
	}
}

function changPositionMonster(index, number_monster){
	let found = false;
	while (found == false){
		let opposite = shape.j - monster[index].j;
		let adjacent= shape.i - monster[index].i;
		let angle = Math.atan(opposite/adjacent);
		if (monster[index].i > shape.i){
			angle = angle + 180;
		}	  
		let velocity= 1;
		let vx = 0;
		let vy = 0;
		let move = Math.random() * Math.floor(1);
		if(move < 0.5){
			vx = Math.floor(velocity * Math.cos(angle));
			monster[index].i = monster[index].i + vx;
			if(monster[index].i < 0 ){
				monster[index].i = 0;
			}else if (monster[index].i > 15){
				monster[index].i = 15;
			}
		}else{
			vy = Math.floor(velocity * Math.sin(angle));
			monster[index].j =monster[index].j + vy
			if(monster[index].j < 0){
				monster[index].j = 0;
			}else if (monster[index].j > 19){
				monster[index].j = 19;
			}
		}
		if(checkMoveMonster( monster[index].i,monster[index].j)){
			found =true;
		}
	}	
	board[monster[index].i][monster[index].j] = number_monster;
}

function checkMoveMonster(i, j){
	if(i < 16 && i >= 0 && j >= 0 && j < 20 && board[i][j] == 1){
		food_was[index_food_was] =[i,j];
		index_food_was++;
	}
	return (i < 16 && i >= 0 && j >= 0 && j < 20 && board[i][j] != 4);
}


//A function that updates the character's location
function changPositionCharacter(){
	let found = false;
	while (found == false){
		let move = Math.floor(Math.random() * Math.floor(4));
		if (move == 0) {
			if (checkMoveLeft()) {
				character.j--;
				found = true;
			}
		}else if (move == 1) {
			if (checkMoveRight()) {
				character.j++;
				found = true;
			}
		}else if (move == 2) {
			if (checkMoveDown()) {
				character.i--;
				found = true;
			}
		} else if (move == 3) {
			if (checkMoveUp()) {
				character.i++;
				found = true;
			}
		}
	}
	board[character.i][character.j] = 5;
}


//Function that checks whether the figure can be moved to the Left
function checkMoveLeft(){
	if(character.j > 0 && board[character.i][character.j - 1] == 1){
		food_was[index_food_was] =[character.i,character.j-1];
		index_food_was++;
	}
	return character.j > 0 && board[character.i][character.j - 1] != 4;

}
//Function that checks whether the figure can be moved to the Right
function checkMoveRight(){
	if(character.j < 19 && board[character.i][character.j + 1] == 1){
		food_was[index_food_was] = [character.i,character.j + 1];
		index_food_was++;
	}
	return character.j < 19 && board[character.i][character.j + 1] != 4;
}
//Function that checks whether the figure can be moved to the Down
function checkMoveDown(){
	if(character.i > 0 && board[character.i - 1][character.j] == 1){
		food_was[index_food_was] = [character.i-1,character.j];
		index_food_was++;
	}
	return character.i > 0 && board[character.i - 1][character.j] != 4;

}
//Function that checks whether the figure can be moved to the Up
function checkMoveUp(){
	if(character.i < 15 && board[character.i + 1][character.j] == 1){
		food_was[index_food_was] = [character.i+1,character.j];
		index_food_was++;
	}
	return character.i < 15 && board[character.i + 1][character.j] != 4;

}

function returnFoodWas(){
	for( let i=0 ; i < food_was.length ; i++){
		obj = food_was[i];
		board[obj[0]][obj[1]] = 1;
	}
	index_food_was = 0;
	food_was = new Array();
}

function mainChangPositionMonster(){
	let index = 6
	for(let i=0; i< monster.length; i++){
		board[monster[i].i][monster[i].j] = 0;
		changPositionMonster(i,index);
	}
}


function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	board[character.i][character.j] = 0;
	returnFoodWas();
	//mainChangPositionMonster();
	changPositionCharacter();
	//i -x
	//j - y
	if (x == 1) { //left
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 19 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) { //up
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 15 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	if (board[shape.i][shape.j] == 5) {
		score = score + 50;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}

	// TODO change score of character
	if (score == 100 ) {
    	Draw();
		window.clearInterval(interval);		
		window.alert("Game completed");
  }else {
		Draw();
	}
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
	walls [14]= [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0];
	for (j = 0; j < board_width; j++){
		walls [15][j] = 0;
	}
}

function isAWall(i, j){
	return walls[i][j] == 1;
}

function isAMonster(i, j){
	return i==15 & j ==19;
}

//color logic

function pickColor() {
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
	// keyboard
	// num_of_ghosts
	// random button	
	var submitOK = true;

	//amount of food
	var food_balls_number = document.getElementById("food_balls_number").value;
	if (isNaN(food_balls_number) || food_balls_number < 50 || food_balls_number > 90) {
		alert("The amount of food balls must be between 50 and 90");
		submitOK = false;
	}

	//game time
	var game_time = document.getElementById("game_time").value;
	if (isNaN(game_time) || game_time < 60) {
		alert("Game time must be at least 60 seconds");
		submitOK = false;
	}

	//amount of ghosts
	var food_balls_number = document.getElementById("ghosts_number").value;
	if (isNaN(food_balls_number)) {
		alert("Select amount of ghosts");
		submitOK = false;
	}

	if(submitOK){
		// update global parameters
		food_from_user = Math.floor(food_balls_number); //in case user input is not an int
		game_time_from_user = Math.floor(game_time); //in case user input is not an int
		Start() // TODO -> is this here?
		//TODO part of the balls....
	}
}

function oneGhost(){
	document.getElementById("ghosts_number").value = "1";
	document.getElementById("ghosts_number").innerHTML = "1";
}

function twoGhosts(){
	document.getElementById("ghosts_number").value = "2";
	document.getElementById("ghosts_number").innerHTML = "2";
}

function threeGhosts(){
	document.getElementById("ghosts_number").value = "3";
	document.getElementById("ghosts_number").innerHTML = "3";
}

function fourGhosts(){
	document.getElementById("ghosts_number").value = "4";
	document.getElementById("ghosts_number").innerHTML = "4";
}