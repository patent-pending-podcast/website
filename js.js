var episodes = [
    {
        id: 1,
        title: 'Episode 1',
        description: 'Here is a description about this episode.'
    },{
        id: 2,
        title: 'Episode 2',
        description: 'Here is a description about this episode.'
    },{
        id: 3,
        title: 'Episode 3',
        description: 'Here is a description about this episode.'
    },{
        id: 4,
        title: 'Episode 4',
        description: 'Here is a description about this episode.'
    },{
        id: 5,
        title: 'Episode 5',
        description: 'Here is a description about this episode.'
    }
];

var sliderContainer = $('.slider-container');
var sliderPlayhead = $('.slider-playhead');
var sliderPlayPause = $('.slider-play-pause');
var sliderepisodeTitle = $('.slider-episode-title');
var myAudio;
var intervalId;

var loadepisodeAndPlayer = function(episodeObj, play){
    sliderPlayPause.find('.fa-spinner').css('opacity', '1');
    sliderPlayPause.find('.fa-play').css('opacity', '0');
    sliderPlayPause.find('.fa-pause').css('opacity', '0');
    sliderepisodeTitle.text(episodeObj.title);

    if(myAudio){
        myAudio.pause();
    }
    myAudio = new Audio();
    myAudio.setAttribute('src', 'audio/' + episodeObj.id + '.mp3');

    if(play === true){
        myAudio.play();
    }

    sliderContainer.off('click');
    sliderContainer.click(function(e){
        var el = $(e.currentTarget);
        var offsetWidth = e.clientX - $(this).offset().left;
        var percentSelected = offsetWidth / el.width();
        myAudio.currentTime = Math.floor(percentSelected * myAudio.duration);
        el.find('.slider-playhead').width(offsetWidth);
    });

    $(window).resize(function(){
        sliderPlayhead.width((myAudio.currentTime / myAudio.duration * 100) + '%');
    });

    sliderPlayPause.off('click');
    sliderPlayPause.click(function(e){
        if(myAudio.paused){
            myAudio.play();
            sliderPlayPause.find('.fa-play').css('opacity', '0');
            sliderPlayPause.find('.fa-pause').css('opacity', '1');
        }else{
            myAudio.pause();
            sliderPlayPause.find('.fa-play').css('opacity', '1');
            sliderPlayPause.find('.fa-pause').css('opacity', '0');
        }
    });

    if(intervalId){
        clearInterval(intervalId);
    }
    intervalId = setInterval(function(){
        if(myAudio.readyState >= 3){
        	sliderPlayPause.find('.fa-spinner').css('opacity', '0');
            sliderPlayhead.width((myAudio.currentTime / myAudio.duration * 100) + '%');
            if(myAudio.paused){
                sliderPlayPause.find('.fa-play').css('opacity', '1');
                sliderPlayPause.find('.fa-pause').css('opacity', '0');
            }else{
                sliderPlayPause.find('.fa-play').css('opacity', '0');
                sliderPlayPause.find('.fa-pause').css('opacity', '1');
            }
        }else{
        	sliderPlayPause.find('.fa-spinner').css('opacity', '1');
        }
    }, 50);
};

loadepisodeAndPlayer(episodes[episodes.length - 1]);

var episodesContainer = $('.episodes');
var episodesHtml = "";
episodes.reverse().forEach(function(episode){
    episodesHtml += "<div class=\"episode\" data-id=\"" + episode.id + "\"><div class=\"episode-title\"><i class=\"fa fa-play\" aria-hidden=\"true\"></i> " + episode.title +"</div><div class=\"episode-description\">" + episode.description + "</div></div>"
});
episodesContainer.empty().append(episodesHtml);
var episode = $('.episode');
episode.click(function(e){
    var el = $(e.currentTarget);
    loadepisodeAndPlayer(episodes.filter(function(episode){
        return episode.id === el.data().id;
    })[0], true);
});
