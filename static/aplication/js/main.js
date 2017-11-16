var viewModel = undefined;
$( document ).ready( function(){
	var charater_template_json = ajax_get_characters();
	charater_template_json = {"characters":charater_template_json}
    viewModel = new build_DND_viewModel(charater_template_json);
    ko.applyBindings(viewModel);
    viewModel.start_app();
});