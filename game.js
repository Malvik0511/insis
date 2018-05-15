window.onload = function(){	
	/*
		Класс игровой цели. 
		Определяет текущие координаты, 
		максимально-возможное значение координат, 
		игровую ценность экземпляра
	*/
	class AimPoint {
		constructor(maxX = 7, maxY = 7){
			this._maxX = maxX - 1;
			this._maxY = maxY - 1;
			this.xCoord = Math.round(Math.random()*this._maxX);
			this.yCoord = Math.round(Math.random()*this._maxY);
			this.score = Math.round(Math.random() * 2) + 1;			
		}		
	}
	
	/*
	 Класс игрока.
	 Определяет методы перемещения и прибавления очков
	*/
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
				this.xCoord = (this._isInField(newX, this._maxX)) ? newX : this.xCoord;
			}
			else if (dist === "ArrowDown" || dist === "Numpad2" || dist === "ArrowUp" || dist === "Numpad8"){
				let newY = (dist  === "ArrowUp" || dist === "Numpad8") ? this.yCoord - 1: this.yCoord + 1;
				this.yCoord = (this._isInField(newY, this._maxY)) ? newY : this.yCoord;
			}
			return this;
		}
		
		_isInField(val, maxVal){
			if (val >= 0 && val <= maxVal) return true;
			return false;
		}
		
		addScore(val){
			if (val < 0 || isNaN(val)) throw Error("val must be natural");
			this.score += val;
			return this;
		}
	}
	
	/*
	Класс посредник, реализует игру.
	Определяет размер поля, длительность игры, текущую цель и игрока
	Определяет основные методы: отрисовка поля, начало игры, конец игры, сделать ход
	*/
	class Mediator{
		constructor(width = 7, height = 7, gameDuration = 60){			
			this._width = (width >= 2) ? width: 2;
			this._height = (height >= 2) ? height: 2;
			this.aim = new AimPoint(this._width, this._height);
			this.player = new PlayerPoint(this._width, this._height);
			this.started = false;
			this.dur = (gameDuration >= 10) ? gameDuration: 10;
			this._stopWatch = null;
		}
		
		drowGameField(){
			let field = "<div class = 'app__field'>";
			for (var i = 0; i < this._height; i++){
				field += "<div class = 'app__field-line'>";
				for (var j = 0; j < this._width; j++){
					field += "<div class = 'app__cell-container'><div class = 'app__cell-container-wrapper'><div class = 'app__cell' id = 'cell-" + i + "-" + j + "'" + "></div></div></div>";
				}
				field += "</div>";
			}
			field += "</div>";			
			document.getElementsByClassName('app__game-field-container')[0].innerHTML = field;
			this.updateMeter()._resizeGameField();
			return this;
		}
		
		start(){
			this.started = true;
			this.drowPoint("player").drowPoint("aim").changeBtnStatus()._switchMeter();	
			return this;			
		}
		
		stop(){
			this.started = false;
			this.wipeOffPoint("player").wipeOffPoint("aim").changeBtnStatus()._switchMeter();
			return this;
		}
		
		nextStage(dist){
			if (this.started){
				this.wipeOffPoint("player").playerMove(dist).drowPoint("player");
			}
		}	
		
		updateMeter(time = this.dur){
			let timerField = document.getElementsByClassName('app__timer')[0];
			timerField.innerHTML = time;
			return this;
		}
		
		_switchMeter(){	
			if (!this._stopWatch){
				let time = this.dur;
				this._stopWatch = setInterval(() =>{
					time--;			
					this.updateMeter(time);
					if (this.dur === 0){
						clearInterval(this._stopWatch);
					}
				}, 1000)
			}
			else clearInterval(this._stopWatch);
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
			let {xCoord, yCoord} = this[target],
				point = document.getElementById('cell-' + yCoord + "-" + xCoord);
			point.classList.add("app__cell_" + target);
			this.tryUpdateAim();	
			point.innerHTML = "<div class = 'app__score'>" + this[target].score + "</div>";
			return this;
		}
		
		wipeOffPoint(target){
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
			this.aim = new AimPoint(this._width, this._height);
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
				this.wipeOffPoint("aim").addScore().newAim().drowPoint("aim");
			}
			return this;
		}

		_resizeGameField(){
			let cellSize = 100/this._width+"%";		
			let cells = document.getElementsByClassName("app__cell-container");
			Array.prototype.forEach.call(cells, cell => {
				cell.style.width = cellSize ;
			})		
			return this;
		}

	}

	var timer;
	let	game = null,
		body = document.getElementsByTagName('body')[0],
		btn = document.getElementsByClassName('app__btn')[0];
		
	initGame();
	
	body.addEventListener('keydown', function(e){
		e.stopPropagation();
		game.nextStage(e.code);
	})

	btn.addEventListener('click', function(e){
		let btn = e.target, dur = game.dur * 1000;
		if (!game.started){
			game.start();
			timer = setTimeout(function(){
				gameResult()
			}, dur);
		}
		else {
			gameResult()
		}
	});

	function initGame(){	
		game = new Mediator(12, 12, 60).drowGameField();
		btn.focus();
	}
	
	function gameResult(){
		game.stop();
		clearTimeout(timer);
		alert ('Ваш результат: ' + game.player.score + ' балл(ов)');
		initGame();
	}		
};





