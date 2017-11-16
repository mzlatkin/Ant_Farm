function build_game_viewModel()
{
    var self = this;

    
    // var mapping = {
    //     'characters': {
    //         create: function (options) {       
    //             return new character_model(options.data);           
    //         }
    //     }
    // };
    // ko.mapping.fromJS(character_json, mapping, self);
    
    

    self.start_app = function()
    {
    	console.log("App Started");
    }

    game_model(self);
}
