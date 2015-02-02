CF.userMain = function() {
  CF.log('starting audio station!');
  audioStation.requestApiInfo();

  // setInterval to check remote player
  setInterval( function() {
    if (audioStation.currentPlayer !== '') {
      var parameters = {
        'method': 'getstatus',
        'additional' : 'song_tag',
        'id': audioStation.currentPlayer
      };
      audioStation.requestRemotePlayer(parameters);
    }
  }, 5000);
  CF.watch(CF.ObjectReleasedEvent, audioStation.volumeSliderJoin, function (join, value, tokens){
    var volume = parseInt(value*100/65535);
    if (audioStation.currentPlayer !== '') {
      audioStation.requestRemotePlayer({'method': 'control', 'action': 'set_volume', 'value': volume, 'id' : audioStation.currentPlayer});
    }
  });
};

var askRemotePlayers = function() {
  CF.getJoin('d204', function(join, value, tokens) {
    if (value == '1') {
      audioStation.requestRemotePlayer({'type': 'all', 'additional': 'subplayer_list', 'method': 'list'});
    }
  });
};
var playPause = function() {
  if (audioStation.currentPlayer !== '') { 
    CF.getJoin(audioStation.playButtonJoin, function(join, value, tokens) {
      if (value == '1') {
        audioStation.requestRemotePlayer({'method': 'control', 'action': 'pause', 'id' : audioStation.currentPlayer});
        CF.setJoin(audioStation.playButtonJoin, 0);
      } else {
        audioStation.requestRemotePlayer({'method': 'control', 'action': 'play', 'id' : audioStation.currentPlayer});
        CF.setJoin(audioStation.playButtonJoin, 1);
      }
    });
  }
};

var selectCategory = function(join) {
  var joinArr = [ { join: 'd100', value: 0 },
                  { join: 'd101', value: 0 },
                  { join: 'd102', value: 0 },
                  { join: 'd103', value: 0 }];
  CF.setJoins(joinArr);
  CF.setJoin(join, 1);
};


var openPopup = function(join) {
  var joinArr = [ { join: 'd200', value: 0 },
                  { join: 'd201', value: 0 },
                  { join: 'd202', value: 0 },
                  { join: 'd203', value: 0 }];
  CF.setJoins(joinArr);
  CF.setJoin(join, 1);
};

var clearCurrentValues = function() {
  audioStation.currentArtist = '';
  audioStation.currentComposer = '';
  audioStation.currentGenre = '';
};

var clearLists = function() {
  CF.listRemove(audioStation.albumList);
  CF.listRemove(audioStation.songList);
  CF.listRemove(audioStation.artistList);
  CF.listRemove(audioStation.composerList);
};

var switchToAlbums = function() {
  openPopup('d200');
  selectCategory('d100');
  clearCurrentValues();
  clearLists();
  audioStation.requestAlbum();
};
var switchToArtists = function() {
  openPopup('d201');
  selectCategory('d101');
  clearCurrentValues();
  clearLists();
  audioStation.requestArtist();
};
var switchToComposers = function() {
  openPopup('d202');
  selectCategory('d102');
  clearCurrentValues();
  clearLists();
  audioStation.requestComposer();
};
var switchToGenres = function() {
  openPopup('d203');
  selectCategory('d103');
  clearCurrentValues();
  clearLists();
  audioStation.requestGenre();
};