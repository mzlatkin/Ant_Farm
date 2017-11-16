$(document).ready(start_function)

function start_function(){
	graph_time = 0
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	ctx.moveTo(0,700);

	update_time = 50;

	queens = 1;
	queen_hunger = 10;
	ant_hunger = 1;
	queen_birthrate = 1;

	gatherer_count = 5;
	gatherers_to_create = 1;
	gatherer_collection = 10;
	gatherer_hunger = 1;


	ant_count = 200;
	food_count = 100;

	
	ant_count_element = $("#ant_count"); 
	food_count_element = $("#food_count"); 
	queen_count_element = $("#queen_count"); 
	gatherer_count_element = $("#gatherer_count"); 

	var start_button = $("#start");
	start_button[0].onclick = function(){
 		update_population_interval = setInterval(function(){ update_population() },update_time);
 		update_graph_interval = setInterval(function(){ update_graph() },(update_time));
 	};

	var stop_button = $("#stop");
	stop_button[0].onclick = function(){
 		clearInterval(update_population_interval);
 		clearInterval(update_graph_interval);
 	};

 	var speed_up_button = $("#speed_up");
	speed_up_button[0].onclick = function(){
		if(update_time!=100)
		{
			update_time-=100
		}
 		clearInterval(update_graph_interval);
		clearInterval(update_population_interval);
 		update_graph_interval = setInterval(function(){ update_graph() },(update_time));
 		update_population_interval = setInterval(function(){ update_population() },update_time);
 	};
 	var slow_down_button = $("#slow_down");
	slow_down_button[0].onclick = function(){
		update_time+=100
 		clearInterval(update_graph_interval);
		clearInterval(update_population_interval);
 		update_graph_interval = setInterval(function(){ update_graph() },(update_time));
 		update_population_interval = setInterval(function(){ update_population() },update_time);
 	};


 	var create_gatherer_button = $("#add_gatherer");
	create_gatherer_button[0].onclick = function(){
 		create_gatherer(gatherers_to_create);
 	};

 	
 	ant_count_element.html(ant_count);
	food_count_element.html(food_count);
	queen_count_element.html(queens);
	gatherer_count_element.html(gatherer_count);
}

function update_population(ant_gain)
{
	var food_collected = gatherer_collection*Math.floor(Math.random() * 10)+1;  


	update_food(food_collected*gatherer_count);

	var total_hunger = (queens*queen_hunger)+(ant_hunger*ant_count)+(gatherer_hunger*gatherer_count);
	
	if(food_count>=total_hunger){
		if(food_count>=queens*queen_hunger)
		{
			queen_gives_birth();
		}
		update_food(ant_hunger*ant_count*(-1));
		update_food(gatherer_hunger*gatherer_count*(-1));
	}
	else
	{
		queen_gives_birth();
		ant_count-=(queens*queen_hunger);
		// ant_count = parseInt(ant_count*0.9)
	}


	ant_count_element.html(ant_count);
}

function queen_gives_birth()
{
	ant_count+=queens*(queen_birthrate*Math.floor(Math.random() * 10)+1);
	update_food(queens*queen_hunger*(-1));
}

function update_food(food_gain)
{
	if(food_gain)
	{
		food_count+=food_gain;
	}

	food_count_element.html(food_count);
}

function create_gatherer(amount)
{
	ant_count-=amount;
	gatherer_count+=amount;
	gatherer_count_element.html(gatherer_count);
}

function add_food(food){
	food_count += food;
	food_count_element.html(food_count);
}

function update_graph()
{
	graph_y = parseInt(700-ant_count)
	graph_time +=1
	ctx.strokeStyle="#000000";
	ctx.lineTo(graph_time,graph_y);
	ctx.stroke(); 
}