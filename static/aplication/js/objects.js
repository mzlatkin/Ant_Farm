function build_DND_viewModel(character_json)
{
    var self = this;

    
    var mapping = {
        'characters': {
            create: function (options) {       
                return new character_model(options.data);           
            }
        }
    };
    ko.mapping.fromJS(character_json, mapping, self);
    
    

    self.start_app = function()
    {
    	console.log(self.characters())
    }



    game_model(self);
}

var character_model = function(data)
{
    var self = this;
    var mapping = {
        'description': {
            create: function (options) {            
                return new description_model(options.data);           
            }
        },
        'ability': {
            create: function (options) {            
                return new ability_model(options.data);           
            }
        },
        'save': {
            create: function (options) {            
                return new save_model(options.data);           
            }
        },
        'skill': {
            create: function (options) {            
                return new skill_model(options.data);           
            }
        },

    };
    ko.mapping.fromJS(data, mapping, self)
};

var description_model = function(data)
{
	var self = this;
	ko.mapping.fromJS(data, {}, self)
}

var ability_model = function(data)
{
	var self = this;
	ko.mapping.fromJS(data, {}, self)
    self.modifier = ko.observable(0)

    if (self.value() >=10){
        self.modifier(Math.floor((self.value() - 10)/2))
    }
    if (self.value() <10){
        self.modifier(Math.floor((self.value() - 10)/2))
    }
    console.log(self.modifier())
}

var save_model = function(data)
{
	var self = this;
	ko.mapping.fromJS(data, {}, self)
}

var skill_model = function(data)
{
	var self = this;
	ko.mapping.fromJS(data, {}, self)
}