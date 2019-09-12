const express = require('express')
const app = express()
const ytlist = require('youtube-playlist');
const Playlist = require('./models/Playlist');
const Song = require('./models/Song');
const path = require('path');
const fetchYoutubeInfo = require('youtube-info');
const ypi = require('youtube-playlist-info');
const playlistBaseUrl = 'https://www.youtube.com/playlist?list=';
const videoBaseUrl = 'https://www.youtube.com/watch?v=';
const youtubedl = require('youtube-dl');
var search = require("youtube-search-promise");

const youtubeApiKey = "AIzaSyA2LX8ZDj_KBZtw2ok4aHve7OuEKteZsIY";

const ytdl = require('ytdl-core');


const playlists = [
    new Playlist("PLXJBEufIar3sF4nWCwj_Q3kdV7TSP_7Yu", "70's", "70s"),
    new Playlist("PLXJBEufIar3sF4nWCwj_Q3kdV7TSP_7Yu", "Electronic", "electro"),
    new Playlist("PLXJBEufIar3sF4nWCwj_Q3kdV7TSP_7Yu", "Hip-Hop", "hiphop"),
    new Playlist("PLXJBEufIar3sF4nWCwj_Q3kdV7TSP_7Yu", "House", "house"),
    new Playlist("PLXJBEufIar3sF4nWCwj_Q3kdV7TSP_7Yu", "pop", "Pop"),
    new Playlist("PLXJBEufIar3sF4nWCwj_Q3kdV7TSP_7Yu", "Rock", "rock"),
    new Playlist("PLXJBEufIar3sF4nWCwj_Q3kdV7TSP_7Yu", "Soul", "soul"),
]

app.get("/getPlaylists", (req, res) => {
    const promises = []
    console.log("requested")
    playlists.forEach(pl => {
        promises.push(new Promise(resolve => {
            ytlist(playlistBaseUrl + pl._id, ['id']).then(result => {
                pl.number = result.data.playlist.length;
                resolve()
            })
        }))
    })
    Promise.all(promises).then(response => {
        res.status(200);
        res.json(playlists);
    })
    
    /*ytdl.getInfo("FxYw0XPEoKE", (err, info) => {
        if (err) throw err;
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        console.log(info.media.artist);
    });*/
})

app.get('/search/:keyword', (req, res) => {
    var opts = {
        maxResults: 5,
        key: youtubeApiKey,
        videoCategoryId: 10,
        type: "video"
    };
    search(req.params.keyword, opts).then(results => {
        const promises = []
        const songs = []
        results.forEach(result => {
            promises.push(new Promise(resolve => {
                try {
                    ytdl.getInfo(result.id, (err, info) => {
                        songs.push(new Song(result.id, info.media.song, info.media.artist, info.length_seconds, ""));
                        resolve();
                    })
                }catch(e) {
                    console.log(e)
                }
            }))
        })
        Promise.all(promises).then(response => {
            res.status(200);
            res.json(songs);
        })
    }).catch(error => {
        console.error(error);
    });
})

app.get('/getPlaylistVideos/:playlistId', (req, res) => {
    ytlist(playlistBaseUrl + req.params.playlistId, ['id', 'name']).then(result => {
        const promises = [];
        const songs = [];
        result.data.playlist.forEach(video => {
            promises.push(new Promise((resolve) => {
                try {
                    ytdl.getInfo(video.id, (err, info) => {
                        songs.push(new Song(video.id, info.media.song, info.media.artist, info.length_seconds, ""));
                        resolve();
                    })
                }catch(e) {
                    console.log(e)
                }
            }));
        })
        Promise.all(promises).then(response => {
            res.status(200);
            res.json(songs);
        });
    })
})

function testYoutubePlaylistInfo(res) {
    ypi(youtubeApiKey, "PLXJBEufIar3s2J5RxdSyDgLXWBTXCVGR6").then(items => {
        console.log(items);
    }).catch(console.error);
}

function getPlayLists(res) {
    console.log("requested");
    const promises = [];
    playlists.forEach(playlist => {
        promises.push(getPlaylistInfo(playlist));
    })
    Promise.all(promises).then(response => {
        res.status(200);
        res.json(playlists);
    })
}

function getPlaylistInfo(playlist) {
    return new Promise((resolve, reject) => {
        ytlist(playlistBaseUrl + playlist.id, ['id', 'name']).then(result => {
            const promises = [];
            const songs = [];
            result.data.playlist.forEach(video => {
                console.log(video)
                promises.push(getSongInfo(songs, video.id));
            })
            Promise.all(promises).then(response => {
                playlist.songs = songs;
                resolve();
            });
        })
    })
}

function getSongInfo(songs, videoId) {
    return new Promise((reject, resolve) => {
        fetchYoutubeInfo(videoId, function (err, videoInfo) {
          if (err) throw new Error(err);
          console.log(videoInfo);
          resolve();
        });

        /*fetchYoutubeInfo(videoId, (videoInfo) => {
            console.log(videoInfo);
        });*/
        /*fetchYoutubeInfo(videoId, (videoInfo) => {
            resolve();
            //songs.push(new Song(videoId, videoInfo.title, videoInfo.owner))
        })*/
    })
}

app.get('/playlists', (req, res) => {

})

app.use("/public", express.static(path.join(__dirname, 'public')))

app.listen(3002, () => {
    //playlistInit();
    console.log("Serverclear up and running on port 3002");
});