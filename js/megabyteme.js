// the timer to run code every second
var Timer = window.setInterval(function(){Tick()},1000);

// the array of components
var Components = [];

// the array of malicious software
var Baddies = [];

// the object constructor for save games
function GameSave()
{
  this.bytes = 0;					// the current level of bytes
	this.bps = 1;						// the current level of bytes per second
	this.baddielvl = 1;			// the baddies' level
	this.warriors = 0;			// the current level of warriors
	this.sacrificed = 0;		// the current level of sacrificed
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
}
// the function to make a new baddie
function MakeBaddie()
{
	// if there are less than 5 baddies
	if (Baddies.length < 5)
	{
		Baddies[Baddies.length] = new Baddie("M",100,100);
	}
}
// the function to initialize the components
function InitComponents()
{
  Components[0] = new Component("CPU",10,1,0,"CPU");
  Components[1] = new Component("MOBO",50,5,0,"MoBo");
  Components[2] = new Component("RAM",1000,10,0,"RAM");
	Components[3] = new Component("AV",100,10,1,"Anti-Virus");
	Components[4] = new Component("MW",100,10,1,"Malware Agent");
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
    document.getElementById(bps).innerHTML = Components[i].persec;
		document.getElementById(btn).value = Components[i].text + " (" + Components[i].cost + ")";
		document.getElementById("bytes-per-sec").innerHTML = game.bps;
	}
	for (var i = 0; i < Baddies.length; i++)
	{
		var idtype = "malsoft" + i;
		var idstat = "malstat" + i;
		document.getElementById(idtype).innerHTML = Baddies[i].type;
		document.getElementById(idstat).innerHTML = Baddies[i].power + " / " + Baddies[i].reward;
		
	}
	document.getElementById("total-bytes").innerHTML = game.bytes;
	document.getElementById("warrior-bytes").innerHTML = game.warriors;
	document.getElementById("sacrificed-bytes").innerHTML = game.sacrificed;
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
			damage = (game.warriors > (Components[3].level * 100)) ? Components[3].level * 100 : game.warriors;
		} else if (Baddies[0].type == "M") {
			// or use the malware agent level to combat the baddie
			damage = (game.warriors > (Components[4].level * 100)) ? Components[4].level * 100 : game.warriors;
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


// the function that runs at the interval
function Tick()
{

	game.bps = BytesPerSecond();
	game.bytes += game.bps;
	game.warriors += game.bps;
	MakeBaddie();
	Fight();
	UpdateDisplay();
}

function Upgrade(id)
{
  if (game.bytes >= Components[id].cost) // is there enough money?
  {
    game.bytes -= Components[id].cost; // decrease the money by the cost
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