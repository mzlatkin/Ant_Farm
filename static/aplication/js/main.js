var viewModel = undefined;
$( document ).ready( function(){
    viewModel = new build_game_viewModel();
    ko.applyBindings(viewModel);
    viewModel.start_app();
});