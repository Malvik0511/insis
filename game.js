window.onload = function(){
	
	class AimPoint {
		constructor(maxX = 7, maxY = 7){
			this.maxX = maxX - 1;
			this.maxY = maxY - 1;
			this.xCoord = Math.round(Math.random() * this.maxX);
			this.yCoord = Math.round(Math.random() * this.maxY)
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
			if (dist === "ArrowLeft" || dist  === "ArrowRight"){
				let newY = (dist  === "ArrowLeft") ? this.yCoord - 1 : this.yCoord + 1
				//console.log(this.isInto(newY, this.maxY))
				this.yCoord = (this.isInto(newY, this.maxY)) ? newY : this.yCoord;
			}
			else if (dist === "ArrowDown" || dist === "ArrowUp"){
				let newX = (dist  === "ArrowUp") ? this.xCoord - 1: this.xCoord + 1;
				this.xCoord = (this.isInto(newX, this.maxX)) ? newX : this.xCoord;
			}
			return this;
		}
		
		isInto(val, maxVal){
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
			this.player = new PlayerPoint(this.width, this.height)
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
			this.drowGameField().drowPlayer().drowAim();
			return this;
		}
		
		endGame(){
			alert('Ваш результат: ' + this.player.score + " баллов")
		}
		
		drowPlayer(){
			let {xCoord, yCoord} = this.player;
			document.getElementById('cell-' + xCoord + "-" + yCoord).classList.add("app__cell_player")	
			return this;
		}
		
		wipeOFPlayer(){
			let {xCoord, yCoord} = this.player;
			document.getElementById('cell-' + xCoord + "-" + yCoord).classList.remove("app__cell_player");	
			return this;
		}
		
		move(dist){
			this.player.move(dist);
			return this;
		}
		
		stroke(dist){
			this.wipeOFPlayer().move(dist).drowPlayer().checkUpdateAim();
		}
		
		drowAim(){
			let {xCoord, yCoord} = this.aim;
			document.getElementById('cell-' + xCoord + "-" + yCoord).classList.add("app__cell_aim");	
			return this;
		}
		
		newAim(){
			this.aim = new AimPoint(this.width, this.height);
			return this;
		}
		
		wipeOFAim(){
			let {xCoord, yCoord} = this.aim;
			document.getElementById('cell-' + xCoord + "-" + yCoord).classList.remove("app__cell_aim");	
			return this;
		}
		
		isAim(){
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
		
		checkUpdateAim(){
			if (this.isAim()){
				this.wipeOFAim().addScore().newAim().drowAim();
			}
			return this;
		}
		
		
		
		
		
	}
	play();
	
	function play(){	
		let game = new Mediator().startGame();
		let target = document.getElementsByTagName('body')[0];
		target.addEventListener('keydown', function(e){
			game.stroke(e.code);
		})
		setTimeout(function(){
			alert ('Ваш результат: ' + game.player.score + ' балл(ов)')
			play();
		},60000);
	}
		
};





