function game_model(obj)
{
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	ctx.moveTo(0,700);

	obj.graph_time = ko.observable(0);

	obj.update_time = ko.observable(10);

	//starting food
	obj.food = ko.observable(8);

	//worker totals
	obj.ant_count = ko.observable(1);
	obj.queens = ko.observable(1);
	obj.gatherer_count = ko.observable(5);

	//amount of food eaten by each individual
	obj.queen_hunger = ko.observable(10);
	obj.ant_hunger = ko.observable(1);
	obj.gatherer_hunger = ko.observable(2);
	
	//total amout of food eaten by a class
	obj.queen_total_hunger = ko.computed(function() {return obj.queens()*obj.queen_hunger();}, this);
	obj.gatherer_total_hunger = ko.computed(function() {return obj.gatherer_hunger()*obj.gatherer_count();}, this);
	obj.ant_total_hunger = ko.computed(function() {return obj.ant_hunger()*obj.ant_count();}, this);

	//queens birthrate (the queen creates queen_birthrate*queen_birthrate_multiplier amounts of ants per tick)
	obj.queen_birthrate = ko.observable(2);
	obj.queen_birthrate_multiplier = ko.observable(10);

	//gatherers gathering rate/total food gathered (obj.gatherer_collection()*obj.gatherer_collection_multiplier())
	obj.gatherer_collection = ko.observable(3);
	obj.gatherer_collection_multiplier = ko.observable(0); //not used for now

	//total food collected per tick 
	obj.total_food_collected = ko.computed(function() {return obj.gatherer_count()*obj.gatherer_collection();}, this);

	//total hunger subracted from food per tick
	obj.total_hunger = ko.computed(function() {return (obj.queens()*obj.queen_hunger())+(obj.ant_hunger()*obj.ant_count())+(obj.gatherer_hunger()*obj.gatherer_count());}, this);

	//food cost of unit
	obj.queen_cost = ko.observable(1000);
	obj.ant_cost = ko.observable(1);
	
	//how many gatheres to create when you press the button
	obj.gatherers_to_create = ko.observable(1);

	//used in making line graph
	obj.previous_food = ko.observable(0);
	obj.previous_ant_count = ko.observable(0);

	obj.update_population = function()
	{
		obj.update_food(obj.total_food_collected());

		if(obj.food()>=obj.total_hunger()){
			if(obj.food()>=obj.queen_total_hunger())
			{
				obj.queen_gives_birth();
			}
			obj.update_food(obj.ant_total_hunger()*(-1));
			obj.update_food(obj.gatherer_total_hunger()*(-1));
		}
		else
		{
			obj.queen_gives_birth();
			obj.ant_count(obj.ant_count()-obj.queen_total_hunger());
			// ant_count = parseInt(ant_count*0.9)
		}
		obj.update_graph()
	}


	// obj.update_population = function(ant_gain)
	// {		
	// 	//update total food with the net food
	// 	change_in_food = (obj.total_food_collected()-obj.total_hunger())
	// 	obj.update_food(change_in_food);
		

	// 	//I want to make it so that as total amout of hunger rises the more ants die thereby lowering the total hunger

	// 	if (obj.food() < 0)
	// 	{
	// 		var ant_total_after_net_change = obj.ant_count()+(obj.food());

	// 		if (ant_total_after_net_change<=0)
	// 			ant_total_after_net_change = 0

	// 		obj.ant_count(ant_total_after_net_change);

	// 		obj.update_food(parseInt(ant_total_after_net_change/2));

	// 		// obj.total_hunger((obj.queens()*obj.queen_hunger())+(obj.ant_hunger()*obj.ant_count())+(obj.gatherer_hunger()*obj.gatherer_count()));
	// 	}
	// 	if (change_in_food>=0)
	// 	{
	// 		obj.queen_gives_birth();
	// 	}

	// 	// obj.queen_total_hunger(obj.queens()*obj.queen_hunger());
	// 	// obj.ant_total_hunger(obj.ant_hunger()*obj.ant_count());
	// 	// obj.gatherer_total_hunger(obj.gatherer_hunger()*obj.gatherer_count());

	// 	obj.update_graph()
	// }

	obj.queen_gives_birth = function()
	{
		obj.ant_count(obj.ant_count()+obj.queens()*(obj.queen_birthrate()*Math.floor(Math.random() * obj.queen_birthrate_multiplier())+1));
		// obj.ant_count(obj.ant_count()+obj.queens()*(obj.queen_birthrate()));
		// obj.update_food(obj.queens()*obj.queen_hunger()*(-1));
	}


	obj.update_food = function(food_gain)
	{
		obj.food(obj.food()+food_gain);
	}

	obj.add_queen = function()
	{
		if (obj.food()>obj.queen_cost())
		{
			obj.food(obj.food()-obj.queen_cost());
			obj.queens(obj.queens()+1);
		}
	}

	obj.add_ant = function()
	{
		obj.food(obj.food()-obj.ant_cost());
		obj.ant_count(obj.ant_count()+1)
	}

	obj.create_gatherer = function()
	{
		if (obj.ant_count()>0)
		{
			obj.ant_count(obj.ant_count()-1)
			obj.gatherer_count(obj.gatherer_count()+1)
		}
	}



	obj.instantiate_buttons = function(){
		var start_button = $("#start");
		start_button[0].onclick = function(){
	 		update_population_interval = setInterval(function(){ obj.update_population() },obj.update_time());
	 	};

		var stop_button = $("#stop");
		stop_button[0].onclick = function(){
	 		clearInterval(update_population_interval);
	 	};
	}

	obj.update_graph = function()
	{
		obj.total_population = ko.observable(obj.queens()+obj.ant_count()+obj.gatherer_count())
		// obj.total_hunger = ko.observable(obj.queens()+obj.ant_count()+obj.gatherer_count())

		// console.log(obj.total_population());
		ant_count = parseInt(500-obj.total_population()/2)
		food_count = parseInt(500-obj.food()/2)
		obj.graph_time(obj.graph_time()+1);
		ctx.strokeStyle="#000000";

		// ctx.lineTo(obj.graph_time(),graph_y);
		// ctx.stroke(); 

		// Draw the red line.
		ctx.beginPath();
		ctx.strokeStyle = '#f00';
		ctx.moveTo(obj.graph_time()-1,obj.previous_ant_count());
		ctx.lineTo(obj.graph_time(),ant_count);
		ctx.stroke();

		// // Draw the green line.
		ctx.beginPath();
		ctx.moveTo(obj.graph_time()-1,obj.previous_food());
		ctx.strokeStyle = '#000';
		ctx.lineTo(obj.graph_time(),food_count);
		ctx.stroke();
		
		obj.previous_food(food_count);
		obj.previous_ant_count(ant_count);
	}

	obj.instantiate_buttons();

}
