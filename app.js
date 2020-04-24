var context;
var shape = new Object();
var character = new Object();
var monster = new Array();
var board;
var score;
var pac_color;
var character_color;
var start_time;
var time_elapsed;
var interval;
var food_was = new Array();
var board_width = 20;
var board_height = 16;
var walls;


$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});


function Start() {
	createWalls();
	board = new Array();
	score = 0;
	pac_color = "yellow";
	character_color = "pink"
	var cnt = board_height * board_width;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	positionMonster()
	for (var i = 0; i < board_height; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < board_width; j++) {
			if(i == 0 && j == 0){
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
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

//A function that defines the monster's location at the beginning of the game
function positionMonster(){
	let index = 6;
	for(i = 0 ; i < monster.length ; i++ ){
		monster[i] =  new Object();
		board[19][15] = index; //Monster
		monster[i].i = 19;
		monster[i].j = 15;
		index++;
	}
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
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = character_color; //color
				context.fill();
				context.beginPath();
			}else if (board[i][j] == 6 || board[i][j] == 7 || board[i][j] == 8 || board[i][j] == 9) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = "bule"; 
				context.fill();
				context.beginPath();
			}
		}
	}
}

//A function that updates the character's location
function changPositionCharacter(was){
	if(was == false){
		board[character.i][character.j] = 0;
	}
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
		food_was[0] =[character.i,character.j-1];
	}
	return character.j > 0 && board[character.i][character.j - 1] != 4;

}
//Function that checks whether the figure can be moved to the Right
function checkMoveRight(){
	if(character.j < 9 && board[character.i][character.j + 1] == 1){
		food_was[0] = [character.i,character.j + 1];
	}
	return character.j < 9 && board[character.i][character.j + 1] != 4;
}
//Function that checks whether the figure can be moved to the Down
function checkMoveDown(){
	if(character.i > 0 && board[character.i - 1][character.j] == 1){
		food_was[0] = [character.i-1,character.j];
	}
	return character.i > 0 && board[character.i - 1][character.j] != 4;

}
//Function that checks whether the figure can be moved to the Up
function checkMoveUp(){
	if(character.i < 9 && board[character.i + 1][character.j] == 1){
		food_was[0] = [character.i+1,character.j];
	}
	return character.i < 9 && board[character.i + 1][character.j] != 4;

}

function return_food_was(){
	for( let i=0 ; i < food_was.length ; i++){
		obj = food_was[i];
		board[obj[0]][obj[1]] = 1;
	}
	if(food_was.length == 0){
		food_was = new Array();
		return false
	}
	food_was = new Array();
	return true
}


function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	was = return_food_was();
	changPositionCharacter(was);
	//i -x
	//j - y
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	if (board[shape.i][shape.j] == 5) {
		score += 50;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}

	// TODO change score of character
	if (score == 100) {
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
	return board[i][j] == 6;
}
