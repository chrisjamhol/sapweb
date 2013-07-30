Crafty.c('Card',{
	value: null,
	table: null,
	oldpos: {
		x: null,
		y: null
	},
	droppedCorrect: false,
	Card: function(table){
		this.table = table;
		this.disableDrag();
		return this;
	}
	,dropped: function(callback){
		var callback = callback;
		this.requires('Collision');
		this.onHit('FieldCardslot',function(data){
			var slot = data[0].obj;
			if(slot.checkEnabled() && !slot.checkTaken())
			{
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
						card.table.cardDropped(card,this);
						card.droppedCorrect = true;
						callback(this);
					});
				}
			}
		});
		var that = this;
		var interval = setInterval(function(){
			if(!that.droppedCorrect)	//bounce back if not droped correct
			{
				if(typeof(that.unbind) != "undefined")
				{
					Crafty('Card').unbind("EnterFrame");
					Crafty('FieldCardslot').unbind("EnterFrame");
				}
				that.x = that.oldpos.x;
				that.y = that.oldpos.y;
				callback("undefined");
			}
			else
			{
				that.droppedCorrect = false;
			}
			window.clearInterval(interval);
		},100);
	}
});