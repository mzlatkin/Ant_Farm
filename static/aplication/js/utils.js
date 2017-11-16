//util functions

$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
         }
         return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});

function get_json_from_server(url)
{    
    var ret = '';
    $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function (data, status, xhr) {
            ret = data;
        }          
    });
    return ret
}

function post_json_to_server(url, data)
{    
    var ret = '';
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        async: false,
        success: function (data, status, xhr) {
            //console.log(ret);
            ret = data;
        }
    });
    return ret
}

function post_blob_to_server(url, data)
{    
    var ret = '';
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        async: false,
        processData: false, 
        contentType: false,
        success: function (data, status, xhr) {
            //console.log(ret);
            ret = data;
        }
    });
    return ret
}

function ajax_write_character(character_json)
{
    var ret = undefined;

    //progress_sent = true;
    var url = "./write_character.php";     
    
    $.ajax({
        type: "POST",
        url: url,
        data: {character: character_json},
        async: false,
        success: function (data, status, xhr) {            
            
        }          
    });
    
    return ret;
}

function ajax_get_character_template()
{
    var ret = undefined;
    $.ajax({
        url: "assets/characters/template.JSON"+'?ts='+new Date().getTime(),
        dataType: "json",
        async: false,
        success: function (data, status, xhr) {
            ret = data;
        }
    });
    return ret;
}

function ajax_get_characters()
{
    var ret = undefined;
    $.ajax({
        url: "assets/characters/characters.JSON"+'?ts='+new Date().getTime(),
        dataType: "json",
        async: false,
        success: function (data, status, xhr) {
            ret = data;
        }
    });
    return ret;
}