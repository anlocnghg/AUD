/*
 * AUD - HTML5 Audio Playlist 
 *	using HTML5 Audio, JavaScript, Bootstrap, and jQuery
 *	09/2015
 * By Loc H. Nguyen
 * Email: loc.nguyen.st.louis[at]Gmail.com
 * URL: locnguyen.us
 * 
 */

var AUD = {
    // * This player is NOT jQuery object, but a HTML5 DOM 
    player: $("#myAudio")[0],
    currentPosition: 0,
    totalTracks: 0,
    init: function () {
        AUD.player.volume = 0.1;
        AUD.totalTracks = $('#myAudioPlaylist option').length;

        $("#myAudioPlaylist").on("change", function () {
            AUD.currentPosition = $("#myAudioPlaylist option:selected").index();
            AUD.playTrack();
        });

        AUD.player.addEventListener("ended", AUD.repeat);

        AUD.toggleRepeatUI();

        AUD.listenToControllers();

        AUD.listenToAudioEvents();
    },
    toggleRepeatUI: function () {
        $("#repeatOptions").hide();
        $("#isRepeat").on("change", function () {
            if ($("#isRepeat").prop("checked")) {
                $("#repeatOptions").show();
            } else {
                $("#repeatOptions").hide();
            }
        });
    },
    listenToControllers: function () {
        $("#playBtn").on("click", function () {
            // Click Play Button affects only when the player is not playing
            if (AUD.player.paused) {
                //$("#myAudioPlaylist").trigger("change"); 
                AUD.playTrack();
            }
        });

        $("#pauseBtn").on("click", function () {
            AUD.player.pause();
        });

        $("#prevBtn").on("click", function () {
            AUD.currentPosition--;
            if (AUD.currentPosition < 0) {
                AUD.currentPosition = 0;
            }
            AUD.playTrack();
        });

        $("#nextBtn").on("click", function () {
            AUD.currentPosition++;
            if (AUD.currentPosition >= AUD.totalTracks) {
                AUD.currentPosition = AUD.totalTracks - 1;
            }
            AUD.playTrack();
        });

        $("#decreaseVolBtn").on("click", function () {
            AUD.player.volume -= 0.1;
            if (AUD.player.volume <= 0) {
                AUD.player.volume = 0;
            }
        });

        $("#increaseVolBtn").on("click", function () {
            AUD.player.volume += 0.1;
            if (AUD.player.volume >= 1) {
                AUD.player.volume = 1;
            }
        });
    },
    setTrack: function () {
        $('#myAudioPlaylist option').eq(AUD.currentPosition).prop('selected', true);

        var trackLink = $("#myAudioPlaylist").val();
        $("#myAudio source").attr("src", trackLink);
    },
    playTrack: function () {
        AUD.setTrack();
        AUD.player.load();
        AUD.player.play();
    },
    repeat: function () {
        if (!$("#isRepeat").prop("checked")) {
            //alert("Not repeat");
        } else {
            // alert("Repeat a single selected track);
            if ($("#optionTrack").prop("checked")) {
                AUD.playTrack();
            } else if ($("#optionPlaylist").prop("checked")) {
                // alert("Repeat the whole playlist orderly);
                AUD.currentPosition++;

                if (AUD.currentPosition >= AUD.totalTracks) {
                    AUD.currentPosition = 0;
                }

                AUD.playTrack();

            } else {
                // alert("Repeat the whole playlist randomly);
                AUD.currentPosition = Math.floor(Math.random() * (AUD.totalTracks - 1));

                AUD.playTrack();
            }
        }
    },
    listenToAudioEvents: function () {
        AUD.player.addEventListener("loadedmetadata", function () {
            var trackName = $("#myAudioPlaylist option:selected").text();
            var trackDuration = AUD.player.duration.toFixed(2);
            var info = trackName + " (" + trackDuration + "s)";

            $("#myAudioStatus p").text("Loaded track: " + info);
        });

        AUD.player.addEventListener("pause", function () {
            var trackName = $("#myAudioPlaylist option:selected").text();
            $("#myAudioStatus p").text("Ready: " + trackName);
        });

        AUD.player.addEventListener("playing", function () {
            var trackName = $("#myAudioPlaylist option:selected").text();
            $("#myAudioStatus p").text("Now playing: " + trackName);
        });
    }
};

$(function () {
    AUD.init();
});