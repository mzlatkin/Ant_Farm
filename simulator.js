function game_model(obj)
{
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	ctx.moveTo(0,700);

	obj.graph_time = ko.observable(0);

	obj.update_time = ko.observable(1000);

	//starting food
	obj.food = ko.observable(8);

	//worker totals
	obj.ant_count = ko.observable(800);
	obj.drone_count = ko.observable(20);
	obj.queen_count = ko.observable(0);
	// obj.drone_count = ko.observable(1);

	//amount of food eaten by each individual
	obj.queen_hunger = ko.observable(10);
	obj.drone_hunger = ko.observable(1);
	obj.ant_hunger = ko.observable(1);
	
	//total amout of food eaten by a class
	obj.queen_total_hunger = ko.computed(function() {return obj.queen_count()*obj.queen_hunger();}, this);
	obj.drone_total_hunger = ko.computed(function() {return obj.drone_hunger()*obj.drone_count();}, this);
	obj.ant_total_hunger = ko.computed(function() {return obj.ant_hunger()*obj.ant_count();}, this);

	//queen birthrate (the queen creates queen_birthrate*queen_birthrate_multiplier amounts of drones per tick)
	obj.queen_birthrate = ko.observable(2);
	obj.queen_birthrate_multiplier = ko.observable(1);

	//drones gathering rate/total food drone (obj.drone_collection()*obj.drone_collection_multiplier())
	obj.drone_food_collection = ko.observable(2);
	obj.drone_collection_multiplier = ko.observable(2); //not used for now

	//total food collected per tick 
	obj.total_food_collected = ko.computed(function() {return obj.drone_count()*obj.drone_food_collection();}, this);

	//total hunger subracted from food per tick
	obj.total_hunger = ko.computed(function() {return (obj.queen_count()*obj.queen_hunger())+(obj.drone_hunger()*obj.drone_count())+(obj.ant_hunger()*obj.ant_count());}, this);

	//food cost of unit
	obj.queen_cost = ko.observable(1000);
	obj.ant_cost = ko.observable(1);
	obj.drone_cost = ko.observable(1); //this will be a computed value
	
	//how many drone to create when you press the button
	obj.ants_to_create = ko.observable(1);

	//used in making line graph
	obj.previous_food = ko.observable(0);
	obj.previous_drone_count = ko.observable(0);

	obj.limiting_value = ko.observable(8000);
	obj.constant_c = ko.observable(0.5);
	// obj.constant_k = ko.observable();


	obj.population_at_time = ko.observable(200);

	obj.carrying_capacity_k = ko.observable(0);
	obj.growth_percent = ko.observable(0.05);

	obj.update_population = function()
	{
		pop = obj.ant_count()
		growth_percent = obj.growth_percent()
		
		// obj.carrying_capacity_k(obj.carrying_capacity_k() + obj.total_food_collected());

		carrying_capacity_k = obj.carrying_capacity_k();

		pop = pop+growth_percent*(1-pop/carrying_capacity_k)*pop
		obj.ant_count(pop);

		console.log(obj.ant_count());
		console.log(carrying_capacity_k);
		obj.update_graph()
	}

	obj.ants_die = function(dead_ants)
	{
		var dead_ants = obj.food()
		//console.log("dead ants: "+Math.floor((-1)*dead_ants/4));

		obj.ant_count(obj.ant_count()+dead_ants) //dead drones is negative

		//console.log("ant: "+obj.ant_count());
		//console.log("dead ants turned to food: "+Math.floor((-1)*dead_ants/4));
		obj.feed_colony(Math.floor((-1)*dead_ants/4)); //dead drones is negative
		//console.log("food: "+obj.food());
	}

	obj.queen_gives_birth = function(net_food_change)
	{
		ants_to_poop_out = obj.queen_count()*(obj.queen_birthrate())

		if(net_food_change>=obj.queen_hunger())
		{
			if (net_food_change/obj.queen_hunger()<1)
			{
				ants_to_poop_out = parseInt(ants_to_poop_out*Math.floor(net_food_change/obj.queen_hunger()));
			}
		}
		// console.log(net_food_change);
		if(net_food_change<0)
		{
			brood_factor = (-net_food_change/(obj.queen_hunger()*obj.queen_count()*10))
		}
		else{
			brood_factor = (obj.food()/(obj.queen_hunger()*obj.queen_count()*10))
		}
		if (brood_factor>1)
		{
			brood_factor=1;
		}
		ants_to_poop_out = parseInt(ants_to_poop_out*brood_factor);


		//console.log("queen gives birth to "+ants_to_poop_out+" ants");
		obj.ant_count(obj.ant_count()+ants_to_poop_out);
	}

	obj.death_to_the_ants = function(dead_ants)
	{
		obj.population_at_time(obj.population_at_time()-dead_ants);
	}


	obj.feed_colony = function(food_gain)
	{
		obj.food(obj.food()+food_gain);
	}

	obj.add_queen = function()
	{
		if (obj.ant_count()>obj.queen_cost())
		{
			console.log(obj.queen_cost())
			obj.ant_count(obj.ant_count()-obj.queen_cost());
			obj.queen_count(obj.queen_count()+1);
		}
		obj.update_population();
	}


	obj.add_ant = function()
	{
		obj.food(obj.food()-obj.ant_cost());
		obj.ant_count(obj.ant_count()+1);
	}

	obj.create_drone = function()
	{
		if (obj.ant_count()>0)
		{
			obj.ant_count(obj.ant_count()-10);
			obj.drone_count(obj.drone_count()+10);
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
		// obj.total_population = ko.observable(obj.queen_count()+obj.drone_count()+obj.ant_count())
		// obj.total_hunger = ko.observable(obj.queen_count()+obj.drone_count()+obj.drone_count())

		// //console.log(obj.total_population());
		drone_count = parseInt(500-obj.ant_count()/2)
		// food_count = parseInt(500-obj.total_food_collected()/8)
		obj.graph_time(obj.graph_time()+1);
		ctx.strokeStyle="#000000";

		// ctx.lineTo(obj.graph_time(),graph_y);
		// ctx.stroke(); 

		// Draw the red line.
		ctx.beginPath();
		ctx.strokeStyle = '#f00';
		ctx.moveTo(obj.graph_time()-1,obj.previous_drone_count());
		ctx.lineTo(obj.graph_time(),drone_count);
		ctx.stroke();

		// // Draw the green line.
		// ctx.beginPath();
		// ctx.moveTo(obj.graph_time()-1,obj.previous_food());
		// ctx.strokeStyle = '#000';
		// ctx.lineTo(obj.graph_time(),food_count);
		// ctx.stroke();
		
		// obj.previous_food(food_count);
		obj.previous_drone_count(drone_count);
	}

	obj.instantiate_buttons();

}
