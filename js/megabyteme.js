// the timer to run code every second
var Timer = window.setInterval(function(){Tick()},1000);

// the array of components
var Components = [];

// the array of malicious software
var Baddies = [];

// the array of floating texts
var TxtFloats = [];

// the object constructor for save games
function GameSave()
{
  this.bytes = 0;						// the current level of bytes
	this.bps = 1;							// the current level of bytes per second
	this.baddielvl = 1;				// the baddies' level
	this.warriors = 0;				// the current level of warriors
	this.sacrificed = 0;			// the current level of sacrificed
	this.upgradeavail = 0;		// the number of available upgrade points
	this.upgradespent = 0;		// the number of spent upgrade points
	this.defeated = 0;				// the number of defeated baddies
}

//the object model for components
function Component(name, cost, persec, level,text)
{
  this.name = name;
  this.cost = cost;
  this.persec = persec;
  this.level = level;
	this.text = text;
}

// the object model for the baddies
function Baddie(type, power, reward)
{
	this.type = type;
	this.power = power;
	this.reward = reward;
	this.slowreward = reward;
	this.ticks = -2;
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
			var power = game.baddielvl * 10;
			chance = Math.random();
			// if chance is more than 50% then make Malware, otherwise make virus
			if (chance > .5)
			{
				Baddies[Baddies.length] = new Baddie("M",power,power/2);
			} else {
				Baddies[Baddies.length] = new Baddie("V",power,power/2);
			}
		}
	}
}
// the function to initialize the components
function InitComponents()
{
  Components[0] = new Component("CPU",10,1,0,"CPU");
  Components[1] = new Component("MOBO",50,5,0,"MoBo");
  Components[2] = new Component("RAM",1000,10,0,"RAM");
	Components[3] = new Component("AV",10,10,0,"Anti-Virus");
	Components[4] = new Component("MW",10,10,0,"Malware Agent");
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
    document.getElementById(bps).innerHTML = Components[i].persec + " / " + Components[i].level * Components[i].persec;
		document.getElementById(btn).value = Components[i].text + " (" + Components[i].cost + ")";
		document.getElementById("bytes-per-sec").innerHTML = game.bps;
	}
	// clear the baddie track
	for (var i = 0; i < 5; i++)
	{
		var idtype = "malsoft" + i;
		var idstat = "malstat" + i;
		document.getElementById(idtype).innerHTML = "&nbsp;";
		document.getElementById(idstat).innerHTML = "&nbsp;";
	}
	
	// fill the baddie track
	for (var i = 0; i < Baddies.length; i++)
	{
		var idtype = "malsoft" + i;
		var idstat = "malstat" + i;
		document.getElementById(idtype).innerHTML = Baddies[i].type;
		document.getElementById(idstat).innerHTML = Baddies[i].power + " / " + Baddies[i].slowreward;	
	}
	document.getElementById("total-bytes").innerHTML = game.bytes;
	document.getElementById("warrior-bytes").innerHTML = game.warriors;
	document.getElementById("sacrificed-bytes").innerHTML = game.sacrificed;
	document.getElementById("total-fixed").innerHTML = game.defeated;
	document.getElementById("available-upgrade").innerHTML = game.upgradeavail;
	document.getElementById("used-upgrade").innerHTML = game.upgradespent;
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
	if (game.defeated > (2 * game.baddielvl + 1) * 10)
	{
		game.baddielvl++;
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
		if (Baddies[0].ticks < 5)
		{
			Baddies[0].ticks++;
			Baddies[0].slowreward = Baddies[0].reward * (1 - Baddies[0].ticks/10);
		}
	}
	// give the user some points to update
	game.upgradeavail++;
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
    Components[id].cost = Math.round(Components[id].cost * 1.25);
		game.bps = BytesPerSecond();
		UpdateDisplay();
	}
}

function BytesPerSecond()
{
	var bps = 1;
  for(var i = 0; i < 3; i++)
  {
    bps += (Components[i].level * Components[i].persec);
  }
	return bps;
}

window.onload = function()
{
  window.game = new GameSave();
  InitComponents();
	UpdateDisplay();
}