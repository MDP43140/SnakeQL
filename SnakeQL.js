var SnakeQL=(x=>{
//s(playerPos + fruitPos + size + trail) = state of the current position
//act(s) = best action so far
//rew = instant reward of taking this step
//s'(s,act) = new state
//Q(s,act) += LR * (rew + DF*max(Q(s',*)) - Q(s,act))
	let qTable={},
			learningRate=1, // Learning Rate (0.85)
			discountFactor=0.9, // Discount Factor of Future Rewards
			randomize=0, // Randomization Rate on Action (0.05)
			availableActs=[],maxLength,fullSetOfStats=0,rewReturn,keyPress,intervalID,i,currState,act,q0,statName,fruitRelativPos,trailRelativPos,q,maxValue,choseAct,actsZero,insRew=0,tileCount=20,player={x:0,y:0},fruit={x:0,y:0},trail=[{x:0,y:0}];
	whichStatNow=x=>{
		fruitRelativPos={x:fruit.x-player.x,y:fruit.y-player.y};trailRelativPos=[];
		if(fruitRelativPos.x < 0) fruitRelativPos.x += tileCount;
		else if(fruitRelativPos.x > tileCount) fruitRelativPos.x -= tileCount;
		if(fruitRelativPos.y < 0) fruitRelativPos.y += tileCount;
		else if(fruitRelativPos.y > tileCount) fruitRelativPos.y -= tileCount;
		maxLength=fullSetOfStats ? trail.length:1;
		for(i=maxLength;i--;){//bug:"0undefined,2,...":{...}
			if(!trailRelativPos[i])trailRelativPos.push({x:0,y:0});
			trailRelativPos[i].x=trail[i].x - player.x;
			trailRelativPos[i].y=trail[i].y - player.y;
			if(trailRelativPos[i].x < 0) trailRelativPos[i].x += tileCount;
			else if(trailRelativPos[i].x > tileCount) trailRelativPos[i].x -= tileCount;
			if(trailRelativPos[i].y < 0) trailRelativPos[i].y += tileCount;
			else if(trailRelativPos[i].y > tileCount) trailRelativPos[i].y -= tileCount;
			statName += ','+trailRelativPos[i].x+','+trailRelativPos[i].y;
		}
		return fruitRelativPos.x+','+fruitRelativPos.y+/*','+trail.length+*/statName;
	};
	whichTable=s=>{if(!qTable[s])qTable[s]={38:0,40:0,37:0,39:0};return qTable[s]}
	bestAct=q=>{
		if(Math.random() < randomize){return availableActs[(~~(Math.random()*availableActs.length))]}
		maxValue=q[availableActs[0]];
		choseAct=availableActs[0];
		actsZero=[];
		for(i=availableActs.length;i--;){
			if(q[availableActs[i]] == 0) actsZero.push(availableActs[i]);
			if(q[availableActs[i]] > maxValue){maxValue=q[availableActs[i]];act=availableActs[i]}
		}
		if(maxValue == 0){choseAct=actsZero[(~~(Math.random()*actsZero.length))]}
		return choseAct;
	}
	return {
		run:x=>{clearInterval(intervalID);intervalID=setInterval(x=>{
			currState=whichStatNow();
			q0=whichTable(currState);
			act=bestAct(q0);
			keyPress(act);
			q1=whichTable(whichStatNow());
			qTable[currState][act]=q0[act] + learningRate * (rewReturn() + discountFactor * Math.max(q1[38],q1[40],q1[37],q1[39]) - q0[act]);
		},x)},
		stop:x=>clearInterval(intervalID),
		reset:x=>qTable={},
		setConf:{
			rewReturn:x=>rewReturn=x,
			keyPress:x=>keyPress=x,
			availableActs:x=>availableActs=x,
			fullSetOfStats:x=>fullSetOfStats=x,
			LearningRate:x=>learningRate=x,
			DiscountFactor:x=>discountFactor=x,
			Randomization:x=>randomize=x,
			tileCount:x=>tileCount=x,
			player:x=>player=x,
			fruit:x=>fruit=x,
			trail:x=>trail=x
		},
		qTable:{export:x=>qTable,import:x=>qTable=x}
	}
})();
/*	
	Changelog:
	+ First release
	- Known Bug: qTable bug ["0undefined,2,...":{...}]
*/
