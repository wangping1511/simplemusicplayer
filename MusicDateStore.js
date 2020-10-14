const Store = require('electron-store')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

class MusicDateStore extends Store {
  constructor(settings) {
    super(settings);
    this.tracks = this.get('tracks') || []
  }
  saveTracks() {
    this.set('tracks', this.tracks)
    return this
  }
  getTracks() {
    return this.get('tracks') || []
  }
  addTracks(tracks) {
    const newTracksArr = tracks.map(track => {
      return {
        id: uuidv4(),
        path: track,
        filename: path.basename(track)
      }
    }).filter(track => {
      const currentTracks = this.getTracks().map(track => track.path)
      return currentTracks.indexOf(track.path) < 0
    })
    this.tracks = [ ...this.tracks, ...newTracksArr ]
    return this.saveTracks()
  }

  deleteTrack(id) {
    this.tracks = this.tracks.filter(track => track.id !== id)
    return this.saveTracks()
  }
}

module.exports = MusicDateStore
