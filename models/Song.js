class Song {
    constructor(id, name, artist, duration, thumbnail) {
        this._id = id;
        this._name = name;
        this._artist = artist;
        this._duration = duration;
        this._thumbnail = thumbnail;
    }
    
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set artist(artist) {
        this._artist = artist;
    }

    get artist() {
        return this._artist;
    }

    set duration(duration) {
        this._duration = duration;
    }

    get duration() {
        return this._duration;
    }

    set thumbnail(thumbnail) {
        this._thumbnail = thumbnail;
    }

    get thumbnail() {
        return this._thumbnail;
    }
}

module.exports = Song