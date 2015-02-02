// --------------------------------------
// Synology AudioStation iViewer module
// Author: Vladimir Shabunin

var audioStation = {
  debug: 1,
  ip: 'demo.synology.com',
  port: '5000',
  protocol: 'http',
  account: 'admin',
  password: 'synology',

  albumList: 'l1',
  songList: 'l2',
  artistList: 'l3',
  composerList: 'l4',
  genreList: 'l5',
  playerList: 'l6',
  playerTitleJoin: 's3',
  volumeSliderJoin: 'a1',
  playButtonJoin: 'd205',
  songTitleJoin: 's4',

  currentArtist: '',
  currentComposer: '',
  currentGenre: '',
  currentPlayer: '',

  // we don't use this array in script, it just enumerate API
  apiList: ['SYNO.API.Auth', 'SYNO.AudioStation.Info', 'SYNO.AudioStation.Album',
            'SYNO.AudioStation.Composer', 'SYNO.AudioStation.Genre', 'SYNO.AudioStation.Artist',
            'SYNO.AudioStation.Folder', 'SYNO.AudioStation.Song', 'SYNO.AudioStation.Stream',
            'SYNO.AudioStation.Radio', 'SYNO.AudioStation.Playlist', 'SYNO.AudioStation.RemotePlayer',
            'SYNO.AudioStation.Proxy', 'SYNO.AudioStation.Lyrics', 'SYNO.AudioStation.LyricsSearch',
            'SYNO.AudioStation.MediaServer', 'SYNO.AudioStation.Cover'],

  // ----------------- Common API

  // request info about all synology API. authorization is not required
  // returns object with API names, paths, versions
  requestApiInfo: function() {
    var that = this;
    this.log('ASK API INFO');
    //var params = '&query=all';// + this.apiList.join(',');
    var params = {
      'query' : 'all'
    };
    var requestParams = {
      'name' : 'SYNO.API.Info',
      'path' : 'query.cgi',
      'method' : 'query',
      'version' : '1',
      'params' : params 
    };    
    this.request(requestParams, function(status, headers, body) {
      that.parseApiInfoResponse(status, headers, body);
    });
  },
  // request Authorization for AudioStation session
  // returns object with sid value
  requestLogin: function() {
    var that = this;
    this.log('LOGIN');

    var params = {
      'account' : this.account,
      'passwd' : this.password,
      'session' : 'AudioStation',
      'format' : 'cookie'
    };
    var requestParams = {
      'name' : 'SYNO.API.Auth',
      'method' : 'login',
      'version' : '3',
      'params' : params 
    };
    this.request(requestParams, function(status, headers, body) {
      that.parseLogin(status, headers, body);
    });    
  },

  // ----------------- AudioStation API
  // request info about audio station.
  requestInfo: function() {
    var that = this;
    this.log('ASK AudioStation INFO');
    var params = {};
    var requestParams = {
      'name' : 'SYNO.AudioStation.Info',
      'method' : 'getinfo',
      'version' : '1',
      'params' : params 
    };  
    this.request(requestParams, function(status, headers, body) {
      that.parseResponse(status, headers, body);
    });
  },
  //request list of albums.
  //
  requestAlbum: function(parameters) {
    var that = this;
    this.log('ASK ALBUM LIST');
    var params = {};
    if (parameters !== undefined) {
       if (parameters.offset !== undefined) {
        params.offset = parameters.offset;
       }
       if (parameters.limit !== undefined) {
        params.limit = parameters.limit;
       }
       if (parameters.library !== undefined) {
        params.library = parameters.library;
       }
       if (parameters.additional !== undefined) {
        params.additional = parameters.additional;
       }
       if (parameters.artist !== undefined) {
        params.artist = parameters.artist;
       }
       if (parameters.composer !== undefined) {
        params.composer = parameters.composer;
       }
       if (parameters.genre !== undefined) {
        params.genre = parameters.genre;
       }
    }
    var requestParams = {
      'name' : 'SYNO.AudioStation.Album',
      'method' : 'list',
      'version' : '1',
      'params' : params,
    };  
    this.request(requestParams, function(status, headers, body) {
      that.parseAlbumResponse(status, headers, body);
    });
  },
  requestArtist: function(parameters) {
    var that = this;
    this.log('ASK ARTIST LIST');
    var params = {};
    if (parameters !== undefined) {
       if (parameters.offset !== undefined) {
        params.offset = parameters.offset;
       }
       if (parameters.limit !== undefined) {
        params.limit = parameters.limit;
       }
       if (parameters.library !== undefined) {
        params.library = parameters.library;
       }
       if (parameters.additional !== undefined) {
        params.additional = parameters.additional;
       }
    }
    var requestParams = {
      'name' : 'SYNO.AudioStation.Artist',
      'method' : 'list',
      'version' : '1',
      'params' : params,
    };  
    this.request(requestParams, function(status, headers, body) {
      that.parseArtistResponse(status, headers, body);
    });
  },
  requestComposer: function(parameters) {
    var that = this;
    this.log('ASK COMPOSER LIST');
    var params = {};
    if (parameters !== undefined) {
       if (parameters.offset !== undefined) {
        params.offset = parameters.offset;
       }
       if (parameters.limit !== undefined) {
        params.limit = parameters.limit;
       }
       if (parameters.library !== undefined) {
        params.library = parameters.library;
       }
       if (parameters.additional !== undefined) {
        params.additional = parameters.additional;
       }
    }
    var requestParams = {
      'name' : 'SYNO.AudioStation.Composer',
      'method' : 'list',
      'version' : '1',
      'params' : params,
    };  
    this.request(requestParams, function(status, headers, body) {
      that.parseComposerResponse(status, headers, body);
    });
  },
  requestGenre: function(parameters) {
    var that = this;
    this.log('ASK GENGE LIST');
    var params = {};
    if (parameters !== undefined) {
       if (parameters.offset !== undefined) {
        params.offset = parameters.offset;
       }
       if (parameters.limit !== undefined) {
        params.limit = parameters.limit;
       }
       if (parameters.library !== undefined) {
        params.library = parameters.library;
       }
       if (parameters.additional !== undefined) {
        params.additional = parameters.additional;
       }
    }
    var requestParams = {
      'name' : 'SYNO.AudioStation.Genre',
      'method' : 'list',
      'version' : '1',
      'params' : params,
    };  
    this.request(requestParams, function(status, headers, body) {
      that.parseGenreResponse(status, headers, body);
    });
  },
  requestCover: function(parameters, callback) {
    var that = this;
    this.log('ASK COVER');
    var params = {};
    var method = 'getCover';
    if (parameters !== undefined){
      if (parameters.method !== undefined) {
        method = parameters.method;
      }

      if (parameters.album_name !== undefined) {
        params.album_name = parameters.album_name;
      }
      if (parameters.album_artist_name !== undefined) {
        params.album_artist_name = parameters.album_artist_name;
      }
      if (parameters.artist_name !== undefined) {
        params.artist_name = parameters.artist_name;
      }
      if (parameters.composer_name !== undefined){
        params.composer_name = parameters.composer_name;
      }
      if (parameters.genre_name !== undefined){
        params.genre_name = parameters.genre_name;
      }
    }
    
    var requestParams = {
      'name' : 'SYNO.AudioStation.Cover',
      'method' : method,
      'version' : '1',
      'params' : params
    };  
    this.requestUrl(requestParams, function(url) {
      that.log(url);
      if (typeof callback === 'function') {
        callback(url);
      }
    });
  }, 
  requestSong: function(parameters) {
    var that = this;
    this.log('ASK SONG');
    var params = {};
    var method = 'list';
    if (parameters !== undefined){
       if (parameters.offset !== undefined) {
        params.offset = parameters.offset;
       }
       if (parameters.limit !== undefined) {
        params.limit = parameters.limit;
       }
       if (parameters.library !== undefined) {
        params.library = parameters.library;
       }
       if (parameters.additional !== undefined) {
        params.additional = parameters.additional;
       }
      if (parameters.album !== undefined) {
        params.album = parameters.album;
      }
      if (parameters.album_artist_name !== undefined) {
        params.album_artist_name = parameters.album_artist_name;
      }
      if (parameters.artist !== undefined) {
        params.artist = parameters.artist;
      }
      if (parameters.composer !== undefined) {
        params.composer = parameters.composer;
      }
      if (parameters.genre !== undefined) {
        params.genre = parameters.genre;
      }
      
      params.additional = 'song_audio,song_tag,song_rating';
    }
    
    var requestParams = {
      'name' : 'SYNO.AudioStation.Song',
      'method' : method,
      'version' : '1',
      'params' : params
    };  
    this.request(requestParams, function(status, headers, body) {
      //that.log(body);
      that.parseSongResponse(status, headers, body);
    });
  }, 
  // Remote player
  requestRemotePlayer: function(parameters, callback) {
    var that = this;
    this.log('REMOTE PLAYER');
    var params = {};
    var method = 'list';
    if (parameters !== undefined) {
      if (parameters.method !== undefined) {
        method = parameters.method;
      }
      if (parameters.type !== undefined) {
        params.type = parameters.type;
      }
      if (parameters.additional !== undefined) {
        params.additional = parameters.additional;
      }
      if (parameters.id !== undefined) {
        params.id = parameters.id;
      }
      if (parameters.offset !== undefined) {
        params.offset = parameters.offset;
      }
      if (parameters.limit !== undefined) {
        params.limit = parameters.limit;
      }
      if (parameters.songs !== undefined) {
        params.songs = parameters.songs;
      }
      if (parameters.updated_index !== undefined) {
        params.updated_index = parameters.updated_index;
      }
      if (parameters.action !== undefined) {
        params.action = parameters.action;
      }
      if (parameters.value !== undefined) {
        params.value = parameters.value;
      }
    }
    var requestParams = {
      'name' : 'SYNO.AudioStation.RemotePlayer',
      'method' : method,
      'version' : '1',
      'params' : params
    };
    this.request(requestParams, function(status, headers, body) {
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          that.parseRemotePlayerResponse(status, headers, body, callback);
        }
      } else {
        that.parseRemotePlayerResponse(status, headers, body);
      }
    });
  },
  request: function(parameters, callback) {
    var that = this;
    // parameters: apiName, path, method, params
    this.log('MAKE REQUEST');
    var url = '/webapi/%path?api=%apiName&version=%version&method=%method';
    if (this.apiInfo !== undefined ) {
      if (this.apiInfo[parameters.name] !== undefined) {
        url = url.replace('%path', this.apiInfo[parameters.name].path);
      }
    } else {
      if (parameters.path !== undefined) {
        url = url.replace('%path', parameters.path);
      }
    }
    url = url.replace('%apiName', parameters.name);
    url = url.replace('%version', parameters.version);
    url = url.replace('%method', parameters.method);
    if (parameters.params !== undefined) {
      for (var k in parameters.params) {
        //this.log('parameter ' + k + '=' + parameters.params[k]);
        var paramStr = parameters.params[k].toString();
        //this.log(this.encodeParameter(paramStr));
        url += '&' + k + '=' + encodeURIComponent(paramStr);
      }
    }
    var headers = {
      'User-Agent' : 'iViewer/4',
    };
    if (this.sid !== undefined) {
      url += '&_sid=' + this.sid;
    }
    url = this.protocol + '://' + this.ip + ':' + this.port + url;
    this.log(url);
    this.log(JSON.stringify(headers));
    CF.request(url, 'GET', headers, function(status, headers, body) {
      if (typeof callback === 'function') {
        callback(status, headers, body);
      }
    });

  },
  requestUrl: function(parameters, callback) {
    var that = this;
    // parameters: apiName, path, method, params
    this.log('MAKE REQUEST');
    var url = '/webapi/%path?api=%apiName&version=%version&method=%method';
    if (this.apiInfo !== undefined ) {
      if (this.apiInfo[parameters.name] !== undefined) {
        url = url.replace('%path', this.apiInfo[parameters.name].path);
      }
    } else {
      if (parameters.path !== undefined) {
        url = url.replace('%path', parameters.path);
      }
    }
    url = url.replace('%apiName', parameters.name);
    url = url.replace('%version', parameters.version);
    url = url.replace('%method', parameters.method);
    if (parameters.params !== undefined) {
      for (var k in parameters.params) {
        this.log('parameter ' + k + '=' + parameters.params[k]);
        url += '&' + k + '=' + encodeURIComponent(parameters.params[k]);
      }
    }
    if (this.sid !== undefined) {
      url += '&_sid=' + this.sid;
    }
    url = this.protocol + '://' + this.ip + ':' + this.port + url;
    if (typeof callback === 'function') {
      callback(url);
    }
    return url;
  },

  // ------------------- parse functions ------------------------
  parseResponse: function(status, headers, body) {
    this.log('PARSE RESPONSE: ' + body);
  },
  parseRemotePlayerResponse: function(status, headers, body, callback) {
    //this.log('PARSE REMOTE PLAYER RESPONSE: ' + body);
    var remotePlayer = JSON.parse(body);
    if (remotePlayer.data !== undefined) {
      if (remotePlayer.data.players !== undefined) {
        var listArr = [];
        for (var i = 0, imax = remotePlayer.data.players.length; i < imax; i += 1) {
          var id = remotePlayer.data.players[i].id;
          var name = remotePlayer.data.players[i].name;
          if (this.currentPlayer === id) {
            // highlight current player
            listArr.push({s1: name, s2: id, d1: 1});
          } else {
            listArr.push({s1: name, s2: id, d1: 0});
          }
        }
        CF.listRemove(this.playerList);
        CF.listAdd(this.playerList, listArr);
      }

      if (remotePlayer.data.volume !== undefined) {
        this.updateVolumeSlider(remotePlayer.data.volume);
      }
      if (remotePlayer.data.state !== undefined) {
        if (remotePlayer.data.state == 'playing') {
          CF.setJoin(this.playButtonJoin, 1);
        } else {
          CF.setJoin(this.playButtonJoin, 0);
        }
      }
      if (remotePlayer.data.song !== undefined) {
        var songTitle = remotePlayer.data.song.title;
        if (remotePlayer.data.song.additional !== undefined) {
          if (remotePlayer.data.song.additional.song_tag !== undefined) {
            songTitle = remotePlayer.data.song.additional.song_tag.artist +' - ' + songTitle;
          }
        }
        CF.setJoin(this.songTitleJoin, songTitle);
      }
    }
    if (callback !== undefined) {
      if (typeof callback === 'function') {
        callback(status, headers, body);
      }
    }
  },
  parseAlbumResponse: function(status, headers, body) {
    var that = this;
    this.log('PARSE ALBUM RESPONSE: ' + body);
    var album = JSON.parse(body);
    if (album.data.albums !== undefined) {
      var listArr = [];
      // If we use sort by Artist or Composer or Genre we add list item 'All songs' with index 0 before albums
      if (this.currentArtist !== '' || this.currentComposer !== '' || this.currentGenre !== '') {
        listArr.push({s1: 'All songs'});
      }
      for(var i = 0, imax = album.data.albums.length; i < imax; i += 1){
        var album_name = album.data.albums[i].name;
        if (album_name === '') {
          album_name = 'Untitled Album';
        }
        var album_artist = album.data.albums[i].album_artist;
        var display_artist = album.data.albums[i].display_artist;
        var parameters = {
          'method' : 'getCover',
          'album_name' : album_name,
        };
        if (album_artist !== '') {
          parameters.album_artist_name = album_artist;
        }
        this.requestCover(parameters, function(url){
          listArr.push({s1: album_name + ' - ' + display_artist, s2: url, s3: album_name, s4: album_artist});
        });
      }

      CF.listRemove(this.albumList);
      CF.listAdd(this.albumList, listArr);
    }
  },
  parseArtistResponse: function(status, headers, body) {
    var that = this;
    this.log('PARSE ARTIST RESPONSE: ' + body);
    var artists = JSON.parse(body);
    if (artists.data.artists !== undefined) {
      var listArr = [];
      for(var i = 0, imax = artists.data.artists.length; i < imax; i += 1){
        var artist_name = artists.data.artists[i].name;
        if (artist_name === '') {
          artist_name = 'Unknown Artist';
        }
        var parameters = {
          'method' : 'getCover',
          'artist_name' : artist_name,
        };

        this.requestCover(parameters, function(url){
          listArr.push({s1: artist_name, s2: url});
        });
      }

      CF.listRemove(this.artistList);
      CF.listAdd(this.artistList, listArr);
    }
  },
  parseComposerResponse: function(status, headers, body) {
    var that = this;
    this.log('PARSE COMPOSER RESPONSE: ' + body);
    var composers = JSON.parse(body);
    if (composers.data.composers !== undefined) {
      var listArr = [];
      for(var i = 0, imax = composers.data.composers.length; i < imax; i += 1){
        var composer_name = composers.data.composers[i].name;

        if (composer_name === '') {
          composer_name = 'Unknown Composer';
        }
        this.log(composer_name);
        var parameters = {
          'method' : 'getCover',
          'composer_name' : composer_name,
        };

        this.requestCover(parameters, function(url){
          listArr.push({s1: composer_name, s2: url}); 
        });
      }

      CF.listRemove(this.composerList);
      CF.listAdd(this.composerList, listArr);
    }
  },
  parseGenreResponse: function(status, headers, body) {
    var that = this;
    this.log('PARSE GENRE RESPONSE: ' + body);
    var genres = JSON.parse(body);
    if (genres.data.genres !== undefined) {
      var listArr = [];
      for(var i = 0, imax = genres.data.genres.length; i < imax; i += 1){
        var genre_name = genres.data.genres[i].name;

        if (genre_name === '') {
          genre_name = 'Unknown Genre';
        }
        this.log(genre_name);
        var parameters = {
          'method' : 'getCover',
          'genre_name' : genre_name,
        }; 
        this.requestCover(parameters, function(url){
          listArr.push({s1: genre_name, s2: url}); 
        });
      }

      CF.listRemove(this.genreList);
      CF.listAdd(this.genreList, listArr);
    }
  },
  parseSongResponse: function(status, headers, body) {
    var that = this;
    this.log('PARSE SONG RESPONSE: ' + body);
    var songs = JSON.parse(body);
    if (songs.data.songs !== undefined) {
      var listArr = [];
      for (var i = 0, imax = songs.data.songs.length; i < imax; i += 1) {
        var title = songs.data.songs[i].title;
        if (title === '') {
          title = 'Untitled';
        }
        var artist = songs.data.songs[i].additional.song_tag.artist;
        var id = songs.data.songs[i].id;
        listArr.push({s1: title, s2: artist, s3: id});
      }
      CF.listRemove(this.songList);
      CF.listAdd(this.songList, listArr);
    }
  },
  parseLogin: function(status, headers, body) {
    //this.log('PARSE LOGIN RESPONSE: ' + JSON.stringify(headers) + '\n\n' + body);
    if (status == 200) {
      var regexId = /(id=[^\;]*)/;
      if (headers['Set-Cookie'] !== undefined) {
        if ( regexId.test(headers['Set-Cookie']) ) {
          var regArr = regexId.exec(headers['Set-Cookie']);
          this.cookieId = regArr[1];
          CF.log(this.cookieId);
        }
      }
      var responseObj = JSON.parse(body);
      if (responseObj.data !== undefined) {
        if (responseObj.data.sid !== undefined)
        {
          this.sid = responseObj.data.sid;
        }
      }
    } else {
      this.log('Error:' + status);
    }
  },
  parseApiInfoResponse: function(status, headers, body) {
    //this.log('PARSE API INFO RESPONSE: ' + body);
    var info = JSON.parse(body);
    this.apiInfo = info.data;
    this.requestLogin();
    //this.log('api info:' + JSON.stringify(this.apiInfo));
  },
  
  // ------------------- gui functions ------------------------
  albumListClick: function(list, listIndex, join) {
    var that = this;
    this.log('ALBUM LIST CLICK');
    CF.listRemove(this.songList);
    CF.listUpdate(list,  [{ index: CF.AllItems, d1: 0 }]);
    CF.listUpdate(list,  [{ index:  listIndex,  d1: 1 }]);

    CF.listContents(list, listIndex, 1, function(items) {
      var album = '';
      var album_artist_name = '';
      var parameters = {
        'offset' : '0',
        'limit' : '1024',
        'library' : 'all',
        //'album' : album,
        //'album_artist_name' : album_artist_name, 
      };
      // When we use sort by artist, composer, genre we add list component with 0 index
      // so here we check if we click this list item
      if ( that.currentArtist !== '' || that.currentComposer !== '' || that.currentGenre !== '') {
        if (listIndex > 0) {
          album = items[0].s3.value;
          album_artist_name = items[0].s4.value;
          if (album === 'Untitled Album') {
            album = '';
          } 
          parameters.album = album;
          parameters.album_artist_name = album_artist_name;
        }
      } else {
        album = items[0].s3.value;
        album_artist_name = items[0].s4.value;
        if (album === 'Untitled Album') {
          album = '';
        } 
        parameters.album = album;
        parameters.album_artist_name = album_artist_name;
      }
      if (that.currentGenre !== '') {
        parameters.genre = that.currentGenre;
      }
      if (that.currentComposer !== '') {
        parameters.composer = that.currentComposer;
      }
      if (that.currentArtist !== '') {
        parameters.artist = that.currentArtist;
      }

      that.requestSong(parameters);
    });
  },
  artistListClick: function(list, listIndex, join) {
    var that = this;
    CF.listRemove(this.albumList);
    CF.listRemove(this.songList);
    this.log('ARTIST LIST CLICK');
    CF.listUpdate(list,  [{ index: CF.AllItems, d1: 0 }]);
    CF.listUpdate(list,  [{ index:  listIndex,  d1: 1 }]);
    CF.listContents(list, listIndex, 1, function(items) {
      that.log(JSON.stringify(items));
      var artist = items[0].s1.value;
      if (artist === 'Unknown Artist') {
        artist = '';
      } 
      var parameters = {
        'offset' : '0',
        'limit' : '1024',
        'library' : 'all',
        'artist' : artist
      };
      that.currentArtist = artist;
      that.requestAlbum(parameters);
    });
  },
  composerListClick: function(list, listIndex, join) {
    var that = this;
    CF.listRemove(this.albumList);
    CF.listRemove(this.songList);
    this.log('COMPOSER LIST CLICK');
    CF.listUpdate(list,  [{ index: CF.AllItems, d1: 0 }]);
    CF.listUpdate(list,  [{ index:  listIndex,  d1: 1 }]);
    CF.listContents(list, listIndex, 1, function(items) {
      that.log(JSON.stringify(items));
      var composer = items[0].s1.value;
      if (composer === 'Unknown Composer') {
        composer = '';
      }
      var parameters = {
        'offset' : '0',
        'limit' : '1024',
        'library' : 'all',
        'composer' : composer
      };
      that.currentComposer = composer;
      that.requestAlbum(parameters);
    });
  },
  genreListClick: function(list, listIndex, join) {
    var that = this;
    CF.listRemove(this.albumList);
    CF.listRemove(this.songList);
    this.log('GENRE LIST CLICK');
    CF.listUpdate(list,  [{ index: CF.AllItems, d1: 0 }]);
    CF.listUpdate(list,  [{ index:  listIndex,  d1: 1 }]);
    CF.listContents(list, listIndex, 1, function(items) {
      that.log(JSON.stringify(items));
      var genre = items[0].s1.value;
      if (genre === 'Unknown Genre') {
        genre = '';
      }
      var parameters = {
        'offset' : '0',
        'limit' : '1024',
        'library' : 'all',
        'genre' : genre
      };
      that.currentGenre = genre;
      that.requestAlbum(parameters);
    });
  },
  playerListClick: function(list, listIndex, join) {
    var that = this;
    this.log('PLAYER LIST CLICK');
    CF.listUpdate(list,  [{ index: CF.AllItems, d1: 0 }]);
    CF.listUpdate(list,  [{ index:  listIndex,  d1: 1 }]);
    CF.listContents(list, listIndex, 1, function(items) {
      that.log(JSON.stringify(items));
      var title = items[0].s1.value;
      CF.setJoin(that.playerTitleJoin, title);
      var currentPlayer = items[0].s2.value;
      that.currentPlayer = currentPlayer;
      that.requestRemotePlayer({'method': 'getstatus', 'additional' : 'song_tag', 'id' : currentPlayer});
    });
  },
  songListClick: function(list, listIndex, join) {
    var that = this;
    this.log('SONG LIST CLICK');
    if (this.currentPlayer !== '') {
      CF.listUpdate(list,  [{ index: CF.AllItems, d1: 0 }]);
      CF.listUpdate(list,  [{ index:  listIndex,  d1: 1 }]);
      // stop current playing
      this.requestRemotePlayer({'method': 'control', 'action': 'stop', 'id' : this.currentPlayer});
      CF.listContents(list, 0, 0, function(items) {
        that.log(JSON.stringify(items));
        var playlist = [];
        // push id of songs in array
        // [music_1, music_2]
        for (var i = 0, imax = items.length; i < imax; i += 1) {
          playlist.push(items[i].s3.value);
        }
        var playlistStr = playlist.join(',');
        //var currentPlayer = that.currentPlayer;
        var parameters = {
          'method': 'updateplaylist',
          'songs': playlistStr,
          'id': that.currentPlayer,
          'offset': 0,
          'limit': 0,
          'updated_index': -1
        };
        // we first ask for old playlist, then get its length and send new playlist 
        // with limit parameter equal to length of old playlist.
        // we do this for whole replacing old playlist.
        that.requestRemotePlayer({'method': 'getplaylist', 'id' : that.currentPlayer}, function(status, headers, body) {
          var remotePlayer = JSON.parse(body);
          if (remotePlayer.data !== undefined) {
            if (remotePlayer.data.songs !== undefined) {
              // assign limit parameter to old playlist length
              // so it will replace whole old playlist
              parameters.limit = remotePlayer.data.songs.length;
              that.requestRemotePlayer(parameters, function(status, headers, body) {
                // after sending playlist start to play song with index listIndex
                // and update status of remote player
                setTimeout( function () {
                  that.requestRemotePlayer({'method': 'control', 'action': 'play', 'value' : listIndex, 'id' : that.currentPlayer});
                }, 1000);
                setTimeout( function () {
                  that.requestRemotePlayer({'method': 'getstatus', 'id' : that.currentPlayer});
                }, 1500);
              });
            }
          }
        });
      });
    }
  },
  updateVolumeSlider: function(volume) {
    var value = 65535*volume/100;
    CF.setJoin(this.volumeSliderJoin, value);
  }, 
  log: function(text) {
    if (this.debug == 1) {
      CF.log('Synology AudioStation:' + text); 
    }
  },
};