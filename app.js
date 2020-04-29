//canvas
var context;
//game board
var board;
var board_width = 16;
var board_height = 16;
var walls;

//images
var wall_img = new Image();
wall_img.src = "resource/photo/wall.png";

var power_img = new Image();
power_img.src = "resource/photo/medicine.png";

var clock_img = new Image();
clock_img.src = "resource/photo/clock.png";

var monster_img = new Image();
monster_img.src = "resource/photo/red_monster.png";

var bonus_img = new Image();
bonus_img.src = "resource/photo/cherry.png";

var pacman_img = new Image();


//pacman
var shape = new Object();
var last_move = "right";
//object
var character = new Object();
var monster = new Array(1);
//Array that save if was food
var food_was = new Array();
var index_food_was = 0; 
//Data
var score;
var start_time;
var time_elapsed;
var game_over =5;//Several attempts
var more_time; //A hourglass that allows for more time
var flag_end_game = false

var audio = new Audio('./resource/audio/Pac-man.mp3');
var interval;

//initial settings definition
var food_from_user = 50;
var game_time_from_user = 200;
//TODO end game if time ended Ortal

//default keys definition
var keyUpCode = 38;
var keyDownCode = 40;
var keyRightCode = 39;
var keyLeftCode = 37;

//initial color definition
var food_color5 = "rgba(17, 211, 201, 0.2)";
var food_color15 = "#528c6c";
var food_color25 = "#f6b73c";
var wall_color = "grey";
var ghost_color = "blue";
var pac_color = "yellow";
var character_color = "pink";


$(document).ready(function() {
	context = canvas.getContext("2d");
});

/*-------------------------------- Start Game------------------------------------ */

//A function that places the objects on the board at the beginning of a game
function Start() {
	initial();
	let cnt = board_height * board_width;
	let food_division = divisionFood(food_from_user)
	let pacman_remain = 1;
	let hourglass = 1;
	let power = 1;
	for (var i = 0; i < board_height; i++) {
		for (var j = 0; j < board_width; j++) {
			if(board[i][j] == 5|| board[i][j] == 6 || board[i][j] == 7 || board[i][j] == 8 || board[i][j] == 9 ){
				continue;
			}
			else if (isAWall(i,j)) {
				board[i][j] = 4;//block
			} else {
				var randomNum = Math.random();
				if(randomNum <= (1.0 * hourglass) / cnt){
					hourglass--;
					board[i][j] = 1;//hourglass
				}
				else if(randomNum <= (1.0 * power) / cnt){
					power--;
					board[i][j] = 3;//power
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
	 if(power > 0){
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 3;
		power--;
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
	initiateKeyListener();
	interval = setInterval(UpdatePosition, 100);
}

function initial(){
	board = new Array();
	for (let i = 0; i < board_height; i++) {
		board[i] = new Array();
	}
	audio.play();
	createWalls();
	pickColor();
	setSettingsDisplayForUser();
	positinBeginMonsterAndChracter()
	flag_end_game = false;
	more_time = 0;
	score = 0;
	game_over = 5;
	updateHeartDisplay();
	start_time = new Date();
}


//A function that saves the key the user pressed
function initiateKeyListener(){
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
function positinBeginMonsterAndChracter(){
	for (let h =0; h < monster.length; h++){
		monster[h] =  new Object();
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
	character.i = 0;
	character.j = 0;
	board[0][0] = 5;
}

//A function that defines the monster's location at the beginning of the game
function positionMonster(number_monster, i, j, index_board){
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
	board[character.i][character.j] = 0;
	for(let j=0; j< monster.length; j++){
		board[monster[j].i][monster[j].j] = 0;
	}
	for(let i=0 ; i < food_was.length ; i++){
		obj = food_was[i];
		board[obj[0]][obj[1]] = obj[2];
	}
	index_food_was = 0;
	food_was = new Array();
}


/*-------------------------------- Position Monster------------------------------------ */

function mainChangPositionMonster(){
	let index = 6;
	for(let i=0; i< monster.length; i++){
		changPositionMonster(i,index);
		index++;
	}
}

function changPositionMonster(index, number_monster){
	let left =Number.MAX_VALUE;;
	let right = Number.MAX_VALUE;;
	let up = Number.MAX_VALUE;;
	let down = Number.MAX_VALUE;;
	if(monster[index].j > 0 && board[monster[index].i][monster[index].j - 1] != 4){//left
		let dx = Math.pow(monster[index].i - shape.i,2)
		let dy =   Math.pow(monster[index].j-1 - shape.j,2)
		left = Math.pow(dx + dy,0.5)
	}
	if (monster[index].j  <  board_width-1 && board[monster[index].i][monster[index].j + 1] != 4) {//right
		let dx = Math.pow(monster[index].i - shape.i,2)
		let dy =   Math.pow(monster[index].j+1 - shape.j,2)
		right = Math.pow(dx + dy,0.5)
	}
	if (monster[index].i  > 0 && board[monster[index].i - 1][monster[index].j] != 4) {//down
		let dx = Math.pow(monster[index].i-1 - shape.i,2)
		let dy =   Math.pow(monster[index].j - shape.j,2)
		down = Math.pow(dx + dy,0.5)
	}
	if (monster[index].i < board_height - 1 && board[monster[index].i + 1][monster[index].j] != 4) {//up
		let dx = Math.pow(monster[index].i + 1 - shape.i,2)
		let dy =   Math.pow(monster[index].j - shape.j,2)
		up = Math.pow(dx + dy,0.5)
	}
	let min = Math.min(up, down, right, left);
	if(min != Number.MAX_VALUE){
		if(min == up ){
			checkMoveUp(monster[index]);
			monster[index].i++;
		}else if(min == down){
			checkMoveDown(monster[index])
			monster[index].i--;
		}else if(min == left){
			checkMoveLeft(monster[index]);
			monster[index].j--;
		}else if(min == right){
			checkMoveRight(monster[index]);
			monster[index].j++;
		}
	}
	
	board[monster[index].i][monster[index].j] = number_monster;
	
}

//Check if a monster has eaten the pacamn
function MonsterAtePacman(){
	let index = 6;
	for(let i=0; i< monster.length; i++){
		if (monster[i].i == shape.i && monster[i].j == shape.j){
			return [i,index];
		}	
		index++;
	}
	return [-1,-1];
}

/*----------------------------heart display--------------------------------------------*/
function updateHeartDisplay(){
	for (let k = 1; k <= game_over; k++){
		document.getElementById('heart'+k).style.display = 'flex';
	}
	for (let k = game_over + 1; k <= 6 ; k++){
		document.getElementById('heart'+k).style.display = 'none';
	}
	
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
	lblTime.value = game_time_from_user - time_elapsed;
	let cell_width = screen.width*0.02;
	let cell_height = screen.height*0.03;
	let radius = 0.4 * cell_width;
	let offset = 50;
	for (var i = 0; i < board_height; i++) {
		for (var j = 0; j < board_width; j++) {
			var center = new Object();
			//  center.y = i * 20 + 50;
			//  center.x = j * 25 + 50;
			center.y = i * 25 + offset;
			center.x = j * 25 + offset;
			let center_for_circle_x = center.x + cell_width*0.5;
			let center_for_circle_y = center.y + cell_height*0.5;
			if (board[i][j] == 2) { // pacman

				pacman_img.src = "resource/photo/pacman_character_"+last_move+".png";
				context.drawImage(pacman_img, center.x, center.y, cell_width, cell_height);

				// context.beginPath();
				// context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				// context.lineTo(center.x, center.y);
				// context.fillStyle = pac_color;
				// context.fill();
				// context.beginPath();
				// context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				// context.fillStyle = "black";
				// context.fill();
			} else if (board[i][j] == 11) { // 5 points food 
				context.beginPath();
				context.arc(center_for_circle_x, center_for_circle_y, radius, 0, 2 * Math.PI); // circle
				context.fillStyle = food_color5;
				context.fill();
			} else if (board[i][j] == 12) { // 15 points food 
				context.beginPath();
				context.arc(center_for_circle_x, center_for_circle_y, radius, 0, 2 * Math.PI); // circle
				context.fillStyle = food_color15;
				context.fill();
			} else if (board[i][j] == 13) { // 25 points food 
				context.beginPath();
				context.arc(center_for_circle_x, center_for_circle_y, radius, 0, 2 * Math.PI); // circle
				context.fillStyle = food_color25;
				context.fill();
			} else if (board[i][j] == 4) { // wall 
				// context.beginPath();
				// context.rect(center.x - 50, center.y - 50, cell_width, cell_height);
				// context.fillStyle = wall_color;
				// context.fill();

				
				context.drawImage(wall_img, center.x, center.y, cell_width, cell_height + 2.5);

			}else if (board[i][j] == 5) { // bonus character

				context.drawImage(bonus_img, center.x, center.y, cell_width, cell_height);

				// context.beginPath();
				// context.arc(center_for_circle_x, center_for_circle_y, radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				// context.lineTo(center_for_circle_x, center_for_circle_y);
				// context.fillStyle = character_color;
				// context.fill();
				// context.beginPath();
			}else if (board[i][j] == 6 || board[i][j] == 7 || board[i][j] == 8 || board[i][j] == 9) { //monster
				
				context.drawImage(monster_img, center.x, center.y, cell_width, cell_height);

				// context.beginPath();
				// context.arc(center.x, center.y, radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				// context.lineTo(center.x, center.y);
				// context.fillStyle = ghost_color; 
				// context.fill();
				// context.beginPath();
			}else if (board[i][j] == 1) { // hourglass
				
				context.drawImage(clock_img, center.x, center.y, cell_width, cell_height)

				// context.beginPath();
				// context.arc(center_for_circle_x, center_for_circle_y, radius, 0, 2 * Math.PI); // circle
				// context.fillStyle = "red";
				// context.fill();
			}else if (board[i][j] == 3) { // power
				
				context.drawImage(power_img, center.x, center.y, cell_width, cell_height - 4.5)

				// context.beginPath();
				// context.arc(center_for_circle_x, center_for_circle_y, radius, 0, 2 * Math.PI); // circle
				// context.fillStyle = "green";
				// context.fill();
			}
		}
	}
}
/*-------------------------------- Update Position---------------------------------------- */

function UpdatePosition() {
	let x = GetKeyPressed();
	returnFoodWas();
	//slow down the characters, they will not move in every interval:
	let move_characters = Math.random();
	if (move_characters >= 0.6){
		mainChangPositionMonster();
		changPositionCharacter();
	}
	board[shape.i][shape.j] = 0;
	//i -x
	//j - y
	if (x == 1) { 
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			last_move = "left";
		}
	}
	if (x == 2) {
		if (shape.j  <  board_width-1 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			last_move = "right";
		}
	}
	if (x == 3) { 
		if (shape.i  > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			last_move = "up";
		}
	}
	if (x == 4) {
		if (shape.i < board_height-1 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			last_move = "down";
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
	if (board[shape.i][shape.j] == 1) {
		more_time = -30;
	}
	if (board[shape.i][shape.j] == 3) {//power
		game_over += 1;
	}
	if (board[shape.i][shape.j] != 6 && board[shape.i][shape.j] != 7
		&& board[shape.i][shape.j] != 8 && board[shape.i][shape.j] != 9) {
		board[shape.i][shape.j] = 2;
	}
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score >= 500 ) {
//		Draw();
		endGame("Winner!!!");
	}
	var currentTime = new Date();
	game_time_from_user += more_time;
	more_time = 0;
	time_elapsed = Math.floor(((currentTime - start_time) / 1000));
	if(time_elapsed >= game_time_from_user){
		//time ended
		if(score < 100){
			endGame("You are better than " + score + " points!");
		}else{
			endGame("Winner!!!");
		}
	}if(flag_end_game == true){
		ShowContent("Setting");
	}
	if(MonsterAtePacman()[0] != -1){
		if(game_over == 1){
			game_over --;
//			Draw();
			endGame("Loser!");		
		}else{
			game_over--;
			score -= 10;
			window.clearInterval(interval);		
			window.alert("We believe in you! Keep playing");
			interval = setInterval(UpdatePosition, 100);
			initiateKeyListener();
			PacmanEaten();
		}
	}
	if(flag_end_game == false) {
		updateHeartDisplay();
//		Draw();
	}

	Draw();
}

function endGame(msg){
	audio.pause();
	window.clearInterval(interval);		
	window.alert(msg);
	flag_end_game = true;
	Start();
}

function PacmanEaten(){
	for(let i=0 ; i<monster.length; i++){
		board[monster[i].i][monster[i].j] = 0
	}
	for(let i=0 ; i<monster.length; i++){
		if(i == 0){
			positionMonster(0,board_height-1, board_width-1,6);
		}else if(i==1){
			positionMonster(1,board_height-1,0,7);
		}else if(i==2){
			positionMonster(2,0, board_width-1,8);
		}else if(i==3){
			positionMonster(3,board_height-1,1,9);
		}
	
	}
	
	board[shape.i][shape.j] = 0
	board[character.i][character.j] = 0
	character.i = 0;
	character.j = 0;
	board[character.i][character.j] = 5;
	let emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 2;
	shape.i = emptyCell[0]
	shape.j = emptyCell[1]
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
	let submitOK = true;

	//amount of food
	let food_balls_number = document.getElementById("food_balls_number").value;
	if (food_balls_number != "" && (food_balls_number < 50 || food_balls_number > 90)) {
		window.alert("The amount of food balls must be between 50 and 90");
		submitOK = false;
	}

	//game time
	let game_time = document.getElementById("game_time").value;
	if (game_time != "" && game_time < 60) {
		window.alert("Game time must be at least 60 seconds");
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
		ShowContent("Game");

	}
}

function setMostersBtn(num){
	document.getElementById("mosterts_number").value = "Amount of Monsters: "+num;
}

function randomSettings(){

	let food_number = randomIntFromInterval(50,90);
	food_from_user = food_number;
	document.getElementById("food_balls_number").value = food_number;

	let game_number = randomIntFromInterval(60,300);
	game_time_from_user = game_number;
	document.getElementById("game_time").value = game_number;

	let monster_num = randomIntFromInterval(1,4);
	monster = new Array(monster_num);
	setMostersBtn(monster_num);
	
	food_color5 = getRandomColor();
	document.querySelector("#five_points").value = food_color5;
	food_color15 = getRandomColor();
	document.querySelector("#fifteen_points").value = food_color15;
	food_color25 = getRandomColor();
	document.querySelector("#twentyfive_points").value = food_color25;


}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function randomIntFromInterval(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function setSettingsDisplayForUser(){
	document.getElementById("food_display").innerHTML = food_from_user;
	document.getElementById("time_display").innerHTML = game_time_from_user;
	document.getElementById("monster_display").innerHTML = monster.length;
}


function keyCodeUp(event) {
	document.getElementById("keyUpCode").value = '';
	keyUpCode = event.keyCode;
	document.getElementById("keyUpCode").placeholder = event.key;
}

function keyCodeDown(event) {
	document.getElementById("keyDownCode").value = '';
	keyDownCode = event.keyCode;
	document.getElementById("keyDownCode").placeholder = event.key;
}
function keyCodeRight(event) {
	document.getElementById("keyRightCode").value = '';
	keyRightCode = event.keyCode;
	document.getElementById("keyRightCode").placeholder = event.key;
}
function keyCodeLeft(event) {
	document.getElementById("keyLeftCode").value = '';
	keyLeftCode = event.keyCode;
	document.getElementById("keyLeftCode").placeholder = event.key;

}
