import React, { useRef, useState, useLayoutEffect } from "react"
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
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
  const mapDiv = useRef(null)
  const mapNode = useRef(null)

  // @ts-ignore
  const { geolonia } = window

  useLayoutEffect(() => {
    if (!mapDiv.current) { return }
    if (mapNode.current !== null) { return }

    mapNode.current = new geolonia.Map({
      container: mapDiv.current,
      style: 'geolonia/gsi',
      interactive: true,
      center: [initialViewState.longitude, initialViewState.latitude],
      bearing: initialViewState.bearing,
      pitch: initialViewState.pitch,
      maxPitch: initialViewState.maxPitch,
      minZoom: initialViewState.minZoom,
      maxZoom: initialViewState.maxZoom,
      zoom: initialViewState.zoom,
    })
  }, [mapDiv, geolonia])

  const onTilesetLoad = tileset => {
    // Recenter view to cover the new tileset
    const {cartographicCenter, zoom} = tileset;
    const lon = cartographicCenter[0]
    const lat = cartographicCenter[1]

    setInitialViewState({
      ...INITIAL_VIEW_STATE,
      longitude: lon,
      latitude: lat,
      zoom
    });

    mapNode.current.jumpTo({
      center: [lon, lat],
      zoom,
    })

    if (updateAttributions) {
      updateAttributions(tileset.credits && tileset.credits.attributions);
    }
  };

  const onViewStateChange = ({viewState}) => {
    mapNode.current.jumpTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch,
    })
  }

  const tile3DLayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    pointSize: 2,
    data: TILESET_URL,
    loader: Tiles3DLoader,
    pickable: true,
    onTilesetLoad,
    onClick: (info, event) => console.log('Clicked:', info, event)
  });

  return (
    <>
      <div
        ref={mapDiv}
        id="map"
        data-navigation-control="off"
      />
      <DeckGL layers={[tile3DLayer]} initialViewState={initialViewState} onViewStateChange={onViewStateChange} controller={true}>
      </DeckGL>
    </>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}