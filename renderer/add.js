const {ipcRenderer} = require('electron')
const {$} = require('./helper')
const path = require('path')
let musicPaths = []

$('select-music-btn').addEventListener('click', () => {
  ipcRenderer.send('select-music-window')
})

$('upload-music-btn').addEventListener('click', () => {
  ipcRenderer.send('add-tracks', musicPaths)
})

const renderListHTML = (paths) => {
  const musicList = $('musicList')
  const musicItemHtml = paths.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`;
    return html
  }, '')
  musicList.innerHTML = `<ul class="list-group">${musicItemHtml}</ul>`
}

ipcRenderer.on('selected-file', (event, args) => {
  if (Array.isArray(args)) {
    renderListHTML(args)
    musicPaths = args
  }
})
