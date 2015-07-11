// the timer to run code every second
var Timer = window.setInterval(function(){Tick()},1000);

// the array of components
var Components = [];

// the object constructor for save games
function GameSave()
{
  this.bytes = 10;
}

//the object model for components
function Component(name, cost, persec, level)
{
  this.name = name;
  this.cost = cost;
  this.persec = persec;
  this.level = level;
}


// the function to initialize the components
function InitComponents()
{
  Components[0] = new Component("CPU",10,1,0);
  Components[1] = new Component("MOBO",50,5,0);
  Components[2] = new Component("RAM",1000,10,0);
}

// the function to initialize the display
function InitDisplay()
{
	for (var i = 0; i < Components.length; i++)
	{
		var idname = Components[i].name.toLowerCase();
		var lvl = idname + "-level";
		var bps = idname + "-bps";
		var btn = idname + "-btn";
    document.getElementById(lvl).innerHTML = Components[i].level;
    document.getElementById(bps).innerHTML = Components[i].persec;
		document.getElementById(btn).value = Components[i].name + " (" + Components[i].cost + ")";
	}
}


// the function that runs at the interval
function Tick()
{
	game.bytes++;
  for(var i = 0; i < Components.length; i++)
  {
    game.bytes += (Components[i].level * Components[i].persec);
  }
  document.getElementById("total-bytes").innerHTML = game.bytes;
}

function Upgrade(id)
{
  if (game.bytes >= Components[id].cost) // is there enough money?
  {
    game.bytes -= Components[id].cost; // decrease the money by the cost
    Components[id].level++; //increase the component level
    Components[id].cost = Math.round(Components[id].cost * 1.25);
		var idname = Components[id].name.toLowerCase();
		var lvl = idname + "-level";
		var bps = idname + "-bps";
		var btn = idname + "-btn";
		document.getElementById("total-bytes").innerHTML = game.bytes;
    document.getElementById(lvl).innerHTML = Components[id].level;
    document.getElementById(bps).innerHTML = Components[id].persec;
		document.getElementById(btn).value = Components[id].name + " (" + Components[id].cost + ")";
	}
}

window.onload = function()
{
  InitComponents();
	InitDisplay();
  window.game = new GameSave();
}