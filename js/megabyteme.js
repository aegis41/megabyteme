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
	if (Baddies.lenth < 5)
	{
		
	}
	
}

// the function to initialize the components
function InitComponents()
{
  Components[0] = new Component("CPU",10,1,0,"CPU");
  Components[1] = new Component("MOBO",50,5,0,"MoBo");
  Components[2] = new Component("RAM",1000,10,0,"RAM");
	Components[3] = new Component("AV",100,10,0,"Anti-Virus");
	Components[4] = new Component("MW",100,10,0,"Malware Agent");
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
	document.getElementById("total-bytes").innerHTML = game.bytes;
	document.getElementById("warrior-bytes").innerHTML = game.warriors;
}


// the function that runs at the interval
function Tick()
{

	game.bps = BytesPerSecond();
	game.bytes += game.bps;
	game.warriors += game.bps;
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
  for(var i = 0; i < Components.length; i++)
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