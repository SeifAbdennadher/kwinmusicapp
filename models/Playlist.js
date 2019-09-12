class Playlist {
    constructor(id, name, thumbnail) {
        this._id = id;
        this._name = name;
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

    set thumbnail(thumbnail) {
        this._thumbnail = thumbnail;
    }

    get thumbnail() {
        return this._thumbnail;
    }

    set number(number) {
        this._number = number;
    }

    get number() {
        return this._number;
    }
}

module.exports = Playlist