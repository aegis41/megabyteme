// the timer to run code every second
var Timer = window.setInterval(function(){Tick()},500),
    Timer2 = window.setInterval(function(){Refresh()},RefreshSpeed);

// the array of components
var Components = [];

// the array of malicious software
var Baddies = [];

// the array of floating texts and float related stuffs
var TxtFloats = [],
    FloatTimer = 3,
    RefreshSpeed = 10,
    FloatIncrement = 1000 / RefreshSpeed * FloatTimer,
    FadeSpeed = 300 / FloatIncrement;

// the object constructor for save games
function GameSave()
{
  this.bytes = 0;						// the current level of bytes
	this.bps = 1;							// the current level of bytes per second
	this.baddielvl = 1;				// the baddies' level
	this.warriors = 0;				// the current level of warriors
	this.sacrificed = 0;			// the current level of sacrificed
	this.upgradeavail = 1000;	// the number of available upgrade points
	this.upgradespent = 0;		// the number of spent upgrade points
	this.defeated = 0;				// the total number of defeated baddies
	this.lvldefeated = 0;			// the number of baddies defeated this level
}

//the object model for components
function Component(name, cost, persec, level, text, hexcolor)
{
  this.name = name;
  this.cost = cost;
  this.persec = persec;
  this.level = level;
    this.text = text;
	this.hexcolor = hexcolor;
}

// the object model for the baddies
function Baddie(type, power, reward, myclass)
{
	this.type = type;
	this.power = power;
	this.reward = reward;
	this.slowreward = reward;
	this.myclass = myclass;
	this.ticks = 0;
}

// the object model for float texts
function TxtFloat (text)
{
	this.id = 0;
	this.time = FloatTimer;
	this.opacity = 100;
	this.text = text;
}

// the function to make a new baddie
function MakeBaddie()
{
	// if there are less than 5 baddies
	if (Baddies.length < 5)
	{
		// there's a chance to spawn a baddie
		var chance = Math.random();
		if (chance > .15)
		{
			var power = game.baddielvl * 100;
			chance = Math.random();
			// if chance is more than 50% then make Malware, otherwise make virus
			if (chance > .5)
			{
				Baddies[Baddies.length] = new Baddie("M",power,Math.round(power/2),"baddie-mw");
			} else {
				Baddies[Baddies.length] = new Baddie("V",power,Math.round(power/2),"baddie-av");
			}
		}
	}
}
// the function to initialize the components
function InitComponents()
{
    // name, cost, power, level
    Components[0] = new Component("CPU",10,1,0,"CPU","#B20000");
    Components[1] = new Component("MOBO",50,5,0,"MoBo","#248F24");
    Components[2] = new Component("RAM",1000,10,0,"RAM","#B26B00");
    Components[3] = new Component("AV",50,10,3,"Anti-Virus", "#8F006B");
    Components[4] = new Component("MW",50,10,3,"Malware Agent", "#0000B2");
}

// the function to initialize the display
function UpdateDisplay()
{
	for (var i = 0; i < Components.length; i++)
	{
		var idname = Components[i].name.toLowerCase();
		var lvl = idname + "-level";
		var bps = idname + "-bps";
		var btn = idname + "-btn";
        document.getElementById(lvl).innerHTML = Components[i].level;
        document.getElementById(bps).innerHTML = Components[i].level * Components[i].persec;
        document.getElementById(btn).value = Components[i].text + " (" + numberWithCommas(Components[i].cost) + ")";
		if (game.upgradeavail >= Components[i].cost)
		{
			document.getElementById(btn).disabled = false;
		} else {
			document.getElementById(btn).disabled = true;
		}
		
		document.getElementById("bytes-per-sec").innerHTML = game.bps;
	}
	// clear the baddie track
	for (var i = 0; i < 5; i++)
	{
		var idtype = "malsoft" + i;
		var idstat = "malstat" + i;
		document.getElementById(idtype).innerHTML = "&nbsp;";
		document.getElementById(idtype).className = "";
		document.getElementById(idstat).innerHTML = "&nbsp;";
		document.getElementById(idstat).className = "";
	}
	
	// fill the baddie track
	for (var i = 0; i < Baddies.length; i++)
	{
		var idtype = "malsoft" + i;
		var idstat = "malstat" + i;
		document.getElementById(idtype).innerHTML = Baddies[i].type;
		document.getElementById(idtype).className = Baddies[i].myclass;
		document.getElementById(idstat).innerHTML = Baddies[i].power + " / " + Baddies[i].slowreward;	
		document.getElementById(idstat).className = Baddies[i].myclass;	
	}
	document.getElementById("total-bytes").innerHTML = numberWithCommas(game.bytes);
	document.getElementById("warrior-bytes").innerHTML = numberWithCommas(game.warriors);
	document.getElementById("sacrificed-bytes").innerHTML = numberWithCommas(game.sacrificed);
	document.getElementById("total-fixed").innerHTML = numberWithCommas(game.defeated);
	document.getElementById("available-upgrade").innerHTML = numberWithCommas(game.upgradeavail);
	document.getElementById("used-upgrade").innerHTML = numberWithCommas(game.upgradespent);
	document.getElementById("bad-level").innerHTML = numberWithCommas(game.baddielvl);
	document.getElementById("progress-bar").style.width = GetProgress() + "%";
	document.getElementById("progress-bar").innerHTML = game.lvldefeated + " / " + game.baddielvl * 20;
}

function Fight()
{
	if (Baddies.length > 0)
	{
		// initialize the damage variable
		var damage = 0;
		
		// if it's a virus
		if (Baddies[0].type == "V")
		{
			// then use the anti-virus level to combat the baddie
			damage = (game.warriors > (Components[3].level * Components[3].persec)) ? Components[3].level * Components[3].persec : game.warriors;
		} else if (Baddies[0].type == "M") {
			// or use the malware agent level to combat the baddie
			damage = (game.warriors > (Components[4].level * Components[4].persec)) ? Components[4].level * Components[4].persec : game.warriors;
		}
		
		// if the baddie has less power than the damage
		if (Baddies[0].power <= damage)
		{
			// decrease the warriors by the power
			game.warriors -= Baddies[0].power;
			// increase the sacrificed bytes
			game.sacrificed += Baddies[0].power;
			// decrease the damage equal to the power
			damage -= Baddies[0].power;
			// then do damage equal to the power
			Baddies[0].power -= Baddies[0].power;
			KillBaddie();
		} else {
			// decrease the warriors
			game.warriors -= damage;
			// increase the sacrificed
			game.sacrificed += damage;
			// otherwise do the damage
			Baddies[0].power -= damage;
		}
	}
}

function KillBaddie()
{
	game.defeated++;
	game.lvldefeated++;
    CreateFloat("Baddie Level " + game.baddielvl + " defeated");
	if (game.lvldefeated > 20 * game.baddielvl)
	{
		game.baddielvl++;
		game.lvldefeated = 0;
	}
	game.upgradeavail += Baddies[0].slowreward;
	Baddies.shift();
	UpdateDisplay();
}


// the function that runs at the interval
function Tick()
{
	// get the bytes per second
	game.bps = BytesPerSecond();
	// increase the game bytes by this much
	game.bytes += game.bps;
	// also increase the warriors by this much
	game.warriors += game.bps;
	// run the script to make a baddie
	MakeBaddie();
	// run the script to FIIIIIIIIIIIIIGHT!!
	Fight();
	// if the baddie wasn't killed in 1 fight, reduce the slow reward
	if (Baddies.length > 0)
	{
		// increment the ticks
		Baddies[0].ticks++;
		// from ticks 2 to 12, lower the reward. 
		if (Baddies[0].ticks > 2 && Baddies[0].ticks <= 10)
		{
			// 100% - (quarter the ticks - 2) / 10 times the original reward
			Baddies[0].slowreward = Math.round((1 - ((Baddies[0].ticks / 4)/10)) * Baddies[0].reward);
		}
	}

    // update the floating texts
    for (var i = 0; i < TxtFloats.length; i++) {
        TxtFloats[i].time--;
        var element = document.getElementById("Float" + TxtFloats[i].id);
        if (TxtFloats[i].time <= 0) {
            element.parentNode.removeChild(element);
            TxtFloats.splice(i,1);
            i--;
        }
    }

	// give the user some points to update
	game.upgradeavail += game.baddielvl+1;
	// update the display
	UpdateDisplay();
}

function Upgrade(id)
{
  if (game.upgradeavail >= Components[id].cost) // is there enough upgrade available?
  {
    game.upgradeavail -= Components[id].cost; // decrease the available by the cost
		game.upgradespent += Components[id].cost;	// increase the spend upgrade by the cost
    Components[id].level++; //increase the component level
    if (id > 2)
    {
    	Components[id].cost = Math.round(Components[id].cost * 1.125);
    } else {
	Components[id].cost = Math.round(Components[id].cost * 1.25);
    }

		game.bps = BytesPerSecond();
		UpdateDisplay();
	}
}

function BytesPerSecond()
{
	var bps = game.baddielvl + 1;
  for(var i = 0; i < 3; i++)
  {
    bps += (Components[i].level * Components[i].persec);
  }
	return bps*2;
}

function GetProgress()
{
	var currentlvl = (game.baddielvl -1) * 20;
	// the number needed to reach the next level
	var nextlvl = (game.baddielvl) * 20;
	// 
	var progress = Math.floor((game.lvldefeated / nextlvl) * 100);
	if (progress < 1)
	{
		progress = 1;
	}
	return progress;
}

window.onload = function()
{
  window.game = new GameSave();
  InitComponents();
	UpdateDisplay();
}

function CreateFloat(text) {
    var el = $("#malsoft0").position();

    for (var i = 0; i < TxtFloats.length; i++) {
        if (TxtFloats[i].id > i) {break;}
    }

    var NewFloat = new TxtFloat(text);

    // initialize the new float
    NewFloat.id = i;
    TxtFloats.splice(i, 0, NewFloat);
    // create the new div
    var NewDiv = document.createElement("div");
    NewDiv.innerHTML = NewFloat.text;
    NewDiv.className = "FloatingText";

    NewDiv.id = "Float" + i;

    NewDiv.style.left = el.left + "px";
    NewDiv.style.top = el.top - 50 + "px";

    document.getElementById("container").appendChild(NewDiv);
}

function Refresh() {
    for (var i = 0; i < TxtFloats.length; i++) {
        var element = document.getElementById("Float" + TxtFloats[i].id);
        element.style.top = (element.offsetTop - 1) + "px";
        TxtFloats[i].opacity -= FadeSpeed;
        element.style.opacity = Math.floor(TxtFloats[i].opacity) / 100;
        element.style.filter = "alpha(opacity=" + Math.floor(TxtFloats[i].opacity) + ")";
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}