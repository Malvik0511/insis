window.onload = function(){
	
	class AimPoint {
		constructor(maxX = 7, maxY = 7){
			this.maxX = maxX - 1;
			this.maxY = maxY - 1;
			this.xCoord = Math.round(Math.random()*this.maxX);
			this.yCoord = Math.round(Math.random()*this.maxY);
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
				let newX = (dist  === "ArrowLeft" || dist === "Numpad4") ? this.xCoord - 1 : this.xCoord + 1;
				this.xCoord = (this.isInField(newX, this.maxX)) ? newX : this.xCoord;
			}
			else if (dist === "ArrowDown" || dist === "Numpad2" || dist === "ArrowUp" || dist === "Numpad8"){
				let newY = (dist  === "ArrowUp" || dist === "Numpad8") ? this.yCoord - 1: this.yCoord + 1;
				this.yCoord = (this.isInField(newY, this.maxY)) ? newY : this.yCoord;
			}
			return this;
		}
		
		isInField(val, maxVal){
			//console.log(val, maxVal)
			if (val >= 0 && val <= maxVal) return true;
			return false;
		}
		
		addScore(val){
			this.score += val;
			return this;
		}
	}
	
	
	class Mediator{
		constructor(width = 7, height = 7, gameDuration = 60){
			this.width = width;
			this.height = height;
			this.aim = new AimPoint(this.width, this.height);
			this.player = new PlayerPoint(this.width, this.height);
			this.started = false;
			this.dur = gameDuration;
			this.stopWatch = null;
		}
		
		resizeGameField(){
			let cellSize = 100/this.width+"%";		
			let cells = document.getElementsByClassName("app__cell-container");
			Array.prototype.forEach.call(cells, cell => {
				cell.style.width = cellSize ;
			})		
			return this;
		}
		
		drowGameField(){
			let field = "<div class = 'app__field'>";
			for (var i = 0; i < this.height; i++){
				field += "<div class = 'app__field-line'>";
				for (var j = 0; j < this.width; j++){
					field += "<div class = 'app__cell-container'><div class = 'app__cell-container-wrapper'><div class = 'app__cell' id = 'cell-" + i + "-" + j + "'" + "></div></div></div>";
				}
				field += "</div>";
			}
			field += "</div>";			
			document.getElementsByClassName('app__game-field-container')[0].innerHTML = field;
			this.updateMeter().resizeGameField();
			return this;
		}
		
		start(){
			this.started = true;
			this.drowPoint("player").drowPoint("aim").changeBtnStatus().meter();	
			return this;			
		}
		
		stop(){
			this.started = false;
			clearInterval(this.stopWatch);
			this.wipeOFPoint("player").wipeOFPoint("aim").changeBtnStatus();
			return this;
		}
		
		nextStage(dist){
			if (this.started){
				this.wipeOFPoint("player").playerMove(dist).drowPoint("player");
			}
		}	
		
		updateMeter(time = this.dur){
			let timerField = document.getElementsByClassName('app__timer')[0];
			timerField.innerHTML = time;
			return this;
		}
		
		meter(){	
			let time = this.dur;
			this.stopWatch = setInterval(() =>{
				time--;			
				this.updateMeter(time);
				if (this.dur == 0){
					clearInterval(this.stopWatch);
				}
			}, 1000)
			return this;
		}
		
		changeBtnStatus(){
			let btn = document.getElementsByClassName('app__btn')[0];
			if (this.started){
				btn.innerHTML = "СТОП";
				btn.classList.remove("app__btn_start");
				btn.classList.add("app__btn_stop");
			}
			else{
				btn.innerHTML = "СТAРТ";
				btn.classList.remove("app__btn_stop");
				btn.classList.add("app__btn_start");
			}
			return this;
		}
		
		drowPoint(target){
			let {xCoord, yCoord} = this[target];
			console.log(xCoord,  yCoord, target)
				let point = document.getElementById('cell-' + yCoord + "-" + xCoord);
			point.classList.add("app__cell_" + target);
			this.tryUpdateAim();	
			point.innerHTML = "<div class = 'app__score'>" + this[target].score + "</div>";
			return this;
		}
		
		wipeOFPoint(target){
			let {xCoord, yCoord} = this[target],
				point = document.getElementById('cell-' + yCoord + "-" + xCoord);
			point.innerHTML = "";
			point.classList.remove("app__cell_" + target);	
			return this;
		}
		
		playerMove(dist){
			this.player.move(dist);
			return this;
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
			return this;
		}
		
		tryUpdateAim(){
			if (this.isAimAttain()){
				this.wipeOFPoint("aim").addScore().newAim().drowPoint("aim");
			}
			return this;
		}		
	}
	
	var timer;
	let	game = null,
		body = document.getElementsByTagName('body')[0],
		btn = document.getElementsByClassName('app__btn')[0];
		
	play();
	
	function play(){	
		game = new Mediator(12, 12).drowGameField();	
	}
	
	function playRes(){
		game.stop();
		clearTimeout(timer);
		alert ('Ваш результат: ' + game.player.score + ' балл(ов)');
		play();
	}
	
	body.addEventListener('keydown', function(e){
		e.stopPropagation();
		game.nextStage(e.code);
	})

	btn.addEventListener('click', function(e){
		let btn = e.target, dur = game.dur*1000;
		if (!game.started){
			game.start();
			timer = setTimeout(function(){
				playRes()
			},dur);
		}
		else {
			playRes()
		}
	});
		
};





