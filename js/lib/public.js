//评分
function score(value, node) {
	if(value % 1 == 0) {
		if(value == 0) {
			for(var i = 0; i < 5; i++) {
				$(node).before("<img src='../../img/important/star1.png' /> ");
			}
		} else {
			for(var i = 0; i < value; i++) {
				$(node).before("<img src='../../img/important/star.png' /> ");
			}
			for(var i = 0; i < 5 - value; i++) {
				$(node).before("<img src='../../img/important/star1.png' /> ");
			}
		}

	} else {
		for(var i = 0; i < parseInt(value); i++) {
			$(node).before("<img src='../../img/important/star.png' /> ");
		}
		$(node).before("<img src='../../img/important/star2.png' /> ");
		for(var i = 0; i < 5 - parseInt(value) - 1; i++) {
			$(node).before("<img src='../../img/important/star1.png' /> ");
		}
	}
};