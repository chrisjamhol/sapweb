Crafty.c('Card',{
	test:"test",
	value: null,
	table: null,
	Card: function(table){
		this.table = table;
		return this;
	}
	,dropped: function(){
		this.requires('Collision');
		this.onHit('Cardslot',function(data){
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
					return this;
				});
			}


		});
	}
});