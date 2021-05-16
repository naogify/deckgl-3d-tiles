import React from "react"
import {render} from 'react-dom'
import DeckGL from '@deck.gl/react'
import {TerrainLayer, Tile3DLayer} from '@deck.gl/geo-layers'
import {Tiles3DLoader} from '@loaders.gl/3d-tiles'

export default function App() {

  const terrainLayer = new TerrainLayer({
    id: "terrain",
    minZoom: 0,
    maxZoom: 14,
    elevationDecoder: {
      rScaler: 6553.6,
      gScaler: 25.6,
      bScaler: 0.1,
      offset: -9965
    },
    elevationData: 'https://tileserver-dev.geolonia.com/gsi-dem/tiles/{z}/{x}/{y}.png',
    texture: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    wireframe: false,
    color: [255, 255, 255],
    pickable: false,
  });

  const tile3DLayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    pointSize: 1,
    data: 'https://raw.githubusercontent.com/naogify/deckgl-3d-tiles/main/tileset.json',
    loader: Tiles3DLoader,
    pickable: true,
    onClick: (info,event)=>{
      console.log(info)
      return true
    },
    opacity: 0.8
  })

  return (
    <DeckGL
      mapStyle={'geolonia/midnight'}
      initialViewState={{
        longitude: 139.7673068,
        latitude: 35.6809591,
        zoom: 14,
        // maxZoom: 18,
        pitch: 60,
        bearing: 0
      }}
      controller={true}
      layers={[terrainLayer, tile3DLayer]}
    />
  )
}

export function renderToDOM(container) {
  render(<App />, container);
}