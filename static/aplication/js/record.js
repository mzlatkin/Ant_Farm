var recorder = ko.observable(undefined);

function rec_request_mic_connection(){
    //console.log("i request mic connection");
    navigator.getUserMedia = (   navigator.getUserMedia|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    var mediaConstraints = {
        audio: true
    };
    if(navigator.getUserMedia){
        navigator.getUserMedia(mediaConstraints, rec_start_user_media, function(){});
        //console.log("mic connect true");
        return true;
    }
    else{
        //console.log("mic connect false");
        return false;
    }
}

/*Chrome and Firefox*/
function rec_start_user_media(stream) {
    recorder(new StereoRecorder(stream));
    recorder().mimeType = 'audio/ogg';
    rec_update_voice_recorder(undefined);

    //set up microphone volume to be visualized
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource( stream );

    meter = createAudioMeter(audioContext);

    // Connect it to the destination to hear yourself (or any other node for processing!)
    mediaStreamSource.connect( meter);
}

function rec_start_recording() {
    rec_stop_recording();
    recorder() && recorder().start();
}

function rec_stop_recording() {
    recorder() && recorder().stop();
    rec_update_voice_recorder();
}

function rec_update_voice_recorder(){
    recorder().ondataavailable = function (blob) {
        if(blob !== 'undefined'){
            //viewModel.magic(blob);
            // console.log(blob);
            var url = window.URL.createObjectURL(blob);
            var voice_mediaRecorder = document.getElementById("record_player");
            var fd = new FormData();

            //console.log(blob);
            fd.append('fname', 'test.wav');
            fd.append('soundfile', blob);
            fd.append('sentance', viewModel.units()[viewModel.selected_unit_number()].phrases()[viewModel.units()[viewModel.selected_unit_number()].selected_phrase_number()].phrase());
            //console.log(fs.readFileSync(url));
            //document.write('<a href="' + url + '">' + url + '</a>');
            //console.log(post_blob_to_server('/studio/record_test', fd));
            viewModel.recording_score_json(JSON.parse(post_blob_to_server('/studio/record_test', fd)));

            viewModel.set_up_outputs();

            voice_mediaRecorder.src = url;
            voice_mediaRecorder.load();
            viewModel.play_button_enabled(true);
        }
    };
}

/*Flash fallback for IE and Safari*/

function flash_update_recording(){
    var wav = sendToFlash('flash_player')[0].stopRecording();
    viewModel.flash_fallback_data(wav);
    viewModel.play_button_enabled(true);

    var blob = b64toBlob(wav, "audio/wav");
    console.log(blob);

    var fd = new FormData();
    //fd.append('fname', 'test.wav');
    fd.append('soundfile', blob);
    fd.append('sentance', viewModel.units()[viewModel.selected_unit_number()].phrases()[viewModel.units()[viewModel.selected_unit_number()].selected_phrase_number()].phrase());
    //console.log(fs.readFileSync(url));
    //document.write('<a href="' + url + '">' + url + '</a>');
    //console.log(post_blob_to_server('/studio/record_test', fd));
    viewModel.recording_score_json(JSON.parse(post_blob_to_server('/studio/record_test', fd)));
    //console.log(recording_score_json);
    viewModel.set_up_outputs();
}

function sendToFlash(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName] || document[movieName];
    } else {
        return document[movieName] || window[movieName];
    }
}

function getWAV() {
    var wav = sendToFlash('flash_player')[0].getRecordedWAV();
    // console.log('Voice Recorder component returned Base64 encoded WAV file of size  ' + wav.length + ' bytes');
    // console.log(wav);
    return wav;
}

function flashDidPlay() {
    //console.log('flash played');
    viewModel.is_player_playing(false);
    //check if the recorder is on the question or exercise level and handle the playing_recording observable accordingly
    // console.log("I played");
    // var obj = viewModel.labs()[viewModel.selected_lab()].exercises()[viewModel.labs()[viewModel.selected_lab()].selected_exercise()];
    // if(typeof obj.question_playing_flash !== 'undefined'){
    //     obj.questions()[obj.question_playing_flash()].playing_recording(false);
    // }
    // else{
    //     obj.playing_recording(false);
    // }
}

function flashSecure() {
    //console.log(document.getElementById('e'));
    //var flash_player = document.getElementById('flashContent');
    // console.log("flash security chosen");
    //document.getElementById('e').style.display = "none";
    viewModel.flash_initialized(true);
    // console.log(viewModel.flash_initialized());
}

function flashWillRecord(){
    // console.log("I am recording");
}

function flashDidRecord(){
    // console.log("I recorded");
}

function flashWillPlay(){
    // console.log("I will play");
}

function flashMicExists(existsValue) {
    // console.log("flashMicExists:"+existsValue);
    viewModel.flash_has_mic(existsValue);             
}


function rec_stop_flash_audio(obj){
    //have to pass obj unfortunately because different products have their playing_recording observable on different levels
    obj.playing_recording(false);
    sendToFlash('flash_player').stopSound();
}
