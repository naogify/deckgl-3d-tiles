import React, { useRef, useState, useLayoutEffect } from "react"
import {render} from 'react-dom';
import {Deck} from '@deck.gl/core';
import {Tile3DLayer} from '@deck.gl/geo-layers';
import {Tiles3DLoader} from '@loaders.gl/3d-tiles';

const TILESET_URL = `./tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 40,
  longitude: -75,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 17
};

export default function App({
  updateAttributions
}) {
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);
  const mapNode = useRef(null)
  const mapDiv = useRef(null)
  const deckDiv = useRef(null)

  const onTilesetLoad = tileset => {
    // Recenter view to cover the new tileset
    const {cartographicCenter, zoom} = tileset;
    setInitialViewState({
      ...INITIAL_VIEW_STATE,
      longitude: cartographicCenter[0],
      latitude: cartographicCenter[1],
      zoom
    });

    if (updateAttributions) {
      updateAttributions(tileset.credits && tileset.credits.attributions);
    }
  };

  const tile3DLayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    pointSize: 2,
    data: TILESET_URL,
    loader: Tiles3DLoader,
    onTilesetLoad
  });

  // @ts-ignore
  const { geolonia } = window

  useLayoutEffect(() => {
    if (!mapDiv.current) { return }
    if (mapNode.current !== null) { return }

    mapNode.current = new geolonia.Map(
      {
        container: mapDiv.current,
        style: 'geolonia/homework',
        interactive: true,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        bearing: initialViewState.bearing,
        pitch: initialViewState.pitch,
      })
  }, [mapDiv, geolonia])

  useLayoutEffect(() => {
    if (!deckDiv.current) { return }

    new Deck({
      container: deckDiv.current,
      width: '100%',
      height: '100%',
      initialViewState: initialViewState,
      controller: true,
      onViewStateChange: ({ viewState }) => {
        mapNode.current.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch,
        })
      },
      layers: [tile3DLayer],
    })

  }, [deckDiv, mapNode])
  
  return (
    <>
        <div id="container">
          <div
            ref={mapDiv}
            id="map"
          />
          <div 
            ref={deckDiv}
            id="deck"
          />
        </div>
    </>
  )
}

export function renderToDOM(container) {
  render(<App />, container);
}
