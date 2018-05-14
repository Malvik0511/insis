window.onload = function(){
	
	class AimPoint {
		constructor(maxX = 7, maxY = 7){
			this.maxX = maxX - 1;
			this.maxY = maxY - 1;
			this.xCoord = Math.round(Math.random() * this.maxX);
			this.yCoord = Math.round(Math.random() * this.maxY);
			this.score = Math.round(Math.random() * 2) + 1;
			
		}		
	}
	
	class PlayerPoint extends AimPoint{
		constructor(maxX, maxY, xCoord = 0, yCoord = 0){
			super(maxX,  maxY)
			this.xCoord = xCoord;
			this.yCoord =  yCoord;
			this.score = 0;
		}
		
		move(dist){
			if (dist === "ArrowLeft" || dist === "Numpad4" || dist  === "ArrowRight" || dist === "Numpad6"){
				let newY = (dist  === "ArrowLeft" || dist === "Numpad4") ? this.yCoord - 1 : this.yCoord + 1
				this.yCoord = (this.isInField(newY, this.maxY)) ? newY : this.yCoord;
			}
			else if (dist === "ArrowDown" || dist === "Numpad2" || dist === "ArrowUp" || dist === "Numpad8"){
				let newX = (dist  === "ArrowUp" || dist === "Numpad8") ? this.xCoord - 1: this.xCoord + 1;
				this.xCoord = (this.isInField(newX, this.maxX)) ? newX : this.xCoord;
			}
			return this;
		}
		
		isInField(val, maxVal){
			if (val >= 0 && val <= maxVal) return true;
			return false;
		}
		
		addScore(val){
			this.score += val;
			return this;
		}
	}
	
	
	class Mediator{
		constructor(width = 7, height = 7){
			this.width = width;
			this.height = height;
			this.aim = new AimPoint(this.width, this.height);
			this.player = new PlayerPoint(this.width, this.height);
			this.started = false;
		}
		
		drowGameField(){
			let field = "<div class = 'app__field'>";
			for (var i = 0; i < this.height; i++){
				field += "<div class = 'app__field-line'>";
				for (var j = 0; j < this.width; j++){
					field += "<div class = 'app__cell' id = 'cell-" + i + "-" + j + "'" + "></div>";
				}
				field += "</div>";
			}
			field += "</div>";			
			document.getElementsByClassName('app__game-field-container')[0].innerHTML = field;
			return this;
		}
		
		startGame(){
			this.drowPoint("player").drowPoint("aim");
			this.started = true;
			return this;
		}
		
		drowPoint(target){
			let {xCoord, yCoord} = this[target],
				point = document.getElementById('cell-' + xCoord + "-" + yCoord);
			point.classList.add("app__cell_" + target);
			this.tryUpdateAim();	
			point.innerHTML = this[target].score;
			return this;
		}
		
		wipeOFPoint(target){
			let {xCoord, yCoord} = this[target],
				point = document.getElementById('cell-' + xCoord + "-" + yCoord);
			point.innerHTML = "";
			point.classList.remove("app__cell_" + target);	
			return this;
		}
		
		playerMove(dist){
			this.player.move(dist);
			return this;
		}

		playerStroke(dist){
			this.wipeOFPoint("player").playerMove(dist).drowPoint("player");
			return this;
		}
		
		circle(dist){
			if (this.started){
				this.playerStroke(dist);
			}
		}		
		
		newAim(){
			this.aim = new AimPoint(this.width, this.height);
			return this;
		}
		
		isAimAttain(){
			if (this.player.xCoord === this.aim.xCoord){
				if (this.player.yCoord === this.aim.yCoord){
					return true;
				}
			}
			return false;
		}
		
		addScore(){
			this.player.addScore(this.aim.score);
			console.log(this.player.score)
			return this;
		}
		
		tryUpdateAim(){
			if (this.isAimAttain()){
				this.wipeOFPoint("aim").addScore().newAim().drowPoint("aim");
			}
			return this;
		}
		
		
		
		
		
	}
	
	let game = null;
	let body = document.getElementsByTagName('body')[0];
	let startBtn = document.getElementsByClassName('app__start')[0];
	play();
	
	function play(){	
		game = new Mediator(30, 30).drowGameField();		
	}


	body.addEventListener('keydown', function(e){
		e.stopPropagation();
		game.circle(e.code);
	})

	startBtn.addEventListener('click', function(){
		game.startGame();
		setTimeout(function(){
			alert ('Ваш результат: ' + game.player.score + ' балл(ов)')
			play();

		},60000);
	});
		
};





