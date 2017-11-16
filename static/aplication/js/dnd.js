function game_model(obj)
{

    obj.blank_character = ko.observable(ko.mapping.toJS(obj.characters()[0]));
    obj.character_array = ko.observableArray(obj.characters());
    obj.spot_check_array = ko.observableArray();
    obj.initiative_array = ko.observableArray();
    obj.selected_character = ko.observable(0);

    obj.initiative_showing = ko.observable(0);

    obj.screens = ko.observableArray([{"name":"Characters","selected":ko.observable(1)},{"name":"Monsters","selected":ko.observable(0)},{"name":"Combat","selected":ko.observable(0)}])

    obj.switch_page = function(selected_page){
        for (var i = obj.screens().length - 1; i >= 0; i--) {
            if (i == selected_page()){
                obj.screens()[i].selected(1)
            }
            else{
                obj.screens()[i].selected(0)
            }
        };
    }

    obj.add_character = function(){
        var charater_template_json = ajax_get_character_template();
        console.log(charater_template_json["characters"])
        // obj.characters.push(new build_DND_viewModel(charater_template_json));
        obj.characters.push(new character_model(charater_template_json["characters"][0]));
    }

    obj.select_character = function(index){
        obj.selected_character(index());
    }

    obj.roll_spot_check = function(){
        obj.spot_check_array([])
        for (var i = 0, i_len = obj.characters().length; i < i_len; ++i)
        {
            name = ""
            spot_rank = 0
            dex_mod = 0
            for (var d = 0, d_len = obj.characters()[i].ability().length; d < d_len; ++d)
            {
                if(obj.characters()[i].ability()[d].name() == "dexterity")
                {
                    dex_mod = obj.characters()[i].ability()[d].modifier();
                }
            }
            for (var d = 0, d_len = obj.characters()[i].description().length; d < d_len; ++d)
            {
                if(obj.characters()[i].description()[d].name() == "name")
                {
                    name = obj.characters()[i].description()[d].value();
                }
            }
            for (var d = 0, d_len = obj.characters()[i].skill().length; d < d_len; ++d)
            {
                if(obj.characters()[i].skill()[d].name() == "spot")
                {
                    spot_rank = obj.characters()[i].skill()[d].value();
                }
            }
            obj.spot_check_array.push({"name":ko.observable(name),"check":ko.observable(obj.roll_d(20) + parseInt(spot_rank) + dex_mod)});

            obj.spot_check_array.sort(function(a, b){
                return b.check()-a.check()
            })
        }
    }
    obj.toggle_initiative = function(){
        obj.initiative_showing(!obj.initiative_showing())

        if(obj.initiative_showing()){
            obj.initiative_array([]);
            for (var i = 0, i_len = obj.characters().length; i < i_len; ++i)
            {
                for (var d = 0, d_len = obj.characters()[i].description().length; d < d_len; ++d)
                {
                    if(obj.characters()[i].description()[d].name() == "name")
                    {
                        obj.initiative_array.push({"name":obj.characters()[i].description()[d].value(),"initiative":ko.observable(0)})
                    }
                }
            }
        }
    }

    obj.add_monster_initiative = function(){
        obj.initiative_array.push({"name":ko.observable(""),"initiative":ko.observable(0)})
    }

    obj.sort_initiative = function(){
        obj.initiative_array.sort(function(a, b){
            return b.initiative()-a.initiative()
        })
    }
    obj.delay_initiative = function(index){
        temp = obj.initiative_array()[index()];
        if(index()+1 == obj.initiative_array().length)
        {
            obj.initiative_array.splice(index(),1);
            obj.initiative_array.splice(1,0,temp);
        }
        else
        {
            obj.initiative_array.splice(index(),1);
            obj.initiative_array.splice(index()+1,0,temp);
        }

    }

    obj.remove_initiative = function(index){
        obj.initiative_array.splice(index(),1)
    }




    obj.order_initiative = function(){

        // for (var i = obj.character_array().length - 1; i >= 0; i--) {
        //     console.log(obj.character_array()[i].intiative());
        //     obj.character_array()[i].intiative(parseInt(obj.character_array()[i].dex())+(Math.floor(Math.random() * 20) + 1 ));
        // };

        // obj.character_array.sort(function(a, b){
        //     return b.intiative()-a.intiative()
        // })
    }

    obj.writeToFile = function(){
        console.log(JSON.stringify(ko.mapping.toJS(obj.characters())))
        ajax_write_character(JSON.stringify(ko.mapping.toJS(obj.characters())));
    }

    obj.roll_d = function(max){
        return Math.floor(Math.random() * (max - 1) + 1);
    }

}