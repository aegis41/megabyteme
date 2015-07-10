// the timer to run code every second
var Time = window.setInterval(function(){Tick()},1000);

// the array of components
var Components = [];

// the object constructor for save games
function GameSave()
{
  this.bytes = 0;
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
  Components[0] = new Component("CPU",10,1,1);
  Components[1] = new Component("MOBO",50,5,1);
  Components[2] = new Component("RAM",1000,10,1);
}

// the function that runs at the interval
function Tick()
{
  for(  var i = 0; i < Components.length; i++)
  {
    game.bytes += 1 + (Components[i].level * Components[i].persec);
  }
  document.getElementByID("bytes").innerHTML = game.bytes;
}

function Upgrade(id)
{
  if (game.bytes >= Components[id].cost) // is there enough money?
  {
    game.bytes -= Components[i].cost; // decrease the money by the cost
    Components[id].level++; //increase the component level
    Components[id].cost = Components[id] * 1.25;
    document.getElementByID(Components[id].name.toLowerCase() + "-level").innerHTML = Component[id].level;
    document.getElementByID(Components[id].name.toLowerCase() + "-bps").innerHTML = Component[id].persec;
  }
}

window.onLoad = Function()
{
  InitComponents();
  window.game = new GameSave();
}
