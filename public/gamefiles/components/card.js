Crafty.c('Card',{
	value: null,
	table: null,
	oldpos: {
		x: null,
		y: null
	},
	droppedCorrect: false,
	checkDroppedInterval: null,
	Card: function(table){
		this.table = table;
		this.disableDrag();
		return this;
	}
	,dropped: function(){
		this.requires('Collision');
		this.onHit('FieldCardslot',function(data){
			this.unbind('EnterFrame');
			var cardslot = data[0].obj;
			if(cardslot != null && cardslot.value==null)
			{
				cardslot.requires('Collision');
				cardslot.collision(
				    new Crafty.polygon(
				    	[this.w*0.3,this.h*0.3],
				    	[this.w*0.7,this.h*0.3],
				    	[this.w*0.7,this.h*0.7],
				    	[this.w*0.3,this.h*0.3])
				);
				cardslot.onHit('Card',function(data){					
					this.unbind("EnterFrame");
					var card = data[0].obj;
					card.x = this.x+5;
					card.y = this.y+5;
					console.log("dropped correct");					
					card.table.cardDropped(card,this);
					card.droppedCorrect = true;
					return this;
				});
			}
		});
		var that = this;
		var interval = setInterval(function(){
			if(!that.droppedCorrect)	//bounce back if not droped correct
			{
				console.log(typeof(this.unbind));
				if(typeof(this.unbind) != "undefined")
				{
					console.log("unbind");
					this.unbind("EnterFrame");
				}
				console.log("bouncing back");
				that.x = that.oldpos.x;
				that.y = that.oldpos.y;
			}else{console.log("not bouncing back");that.droppedCorrect = false;}
			window.clearInterval(interval);
		},200);
			
		// console.log(this.x);
		// console.log(this.origin());
		// console.log(this.pos());
		// console.log(this);
	}
});