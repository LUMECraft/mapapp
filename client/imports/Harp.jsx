// @ts-check
import {onMount} from 'solid-js'
import {MapView} from '@here/harp-mapview'
import {GeoCoordinates, sphereProjection} from '@here/harp-geoutils'
import {APIFormat, AuthenticationMethod, OmvDataSource} from '@here/harp-omv-datasource'
import {OmvTileDecoder} from '@here/harp-omv-datasource/index-worker'
import {MapControls, MapControlsUI} from '@here/harp-map-controls'

import {harp} from '../../imports/keys.js'

export function Harp() {
	/** @type {HTMLCanvasElement} */
	let canvas

	onMount(() => {
		const useWOrker = true

		// import OmvTileDecoderService inside a web Worker with vanilla JS, thanks to
		// the JSPM ES Module CDN (https://jspm.io).
		const workerCode = /*js*/ `
        async function main() {
            const { OmvTileDecoderService } = (
                await import('https://dev.jspm.io/@here/harp-omv-datasource@0.13.1/index-worker')
            ).default

            OmvTileDecoderService.start()
        }

        main()
    `
		const blob = new Blob([workerCode], {type: 'application/javascript'})

		const mapView = new MapView({
			canvas,

			// theme: 'https://unpkg.com/@here/harp-map-theme@0.13.0/resources/berlin_tilezen_night_reduced.json',
			theme: 'https://unpkg.com/@here/harp-map-theme@0.13.0/resources/berlin_tilezen_base.json',

			...(useWOrker
				? {
						decoderUrl: URL.createObjectURL(blob),
				  }
				: {
						/**
						 * This is the part I was confused with: ignore these options, instead
						 * set the 'decoder' option in the 'OmvDataSource', see below.
						 */
						// decoderUrl: "harp-gl-decoders.bundle.js",
						// decoderCount: 0,
				  }),

			//For tile cache optimization:
			maxVisibleDataSourceTiles: 40,
			tileCacheSize: 100,

			projection: sphereProjection,
		})

		// These two are roughly the same, one uses meter distance, one uses zoom level.
		// mapView.setCameraGeolocationAndZoom(new GeoCoordinates(40.70398928, -74.01319808), 14)
		mapView.lookAt(new GeoCoordinates(40.70398928, -74.01319808), 11500)

		// mapView.lookAt({
		// 	target: new GeoCoordinates(40.70398928, -74.01319808),
		// 	zoomLevel: 16,
		// }) TODO use new API

		mapView.resize(canvas.clientWidth, canvas.clientHeight)
		window.onresize = () => mapView.resize(canvas.clientWidth, canvas.clientHeight)

		let defaultControls = false

		if (defaultControls) {
			MapControls.create(mapView)
		} else {
			const mapControls = new MapControls(mapView)

			const ui = new MapControlsUI(mapControls, {
				projectionSwitch: true,
			})

			// TODO move into the component.
			document.querySelector('#map').appendChild(ui.domElement)

			// mapControls.maxPitchAngle = 90;
			// mapControls.setRotation(6.3, 50);
			// mapControls.camera.rotation
		}

		const omvDataSource = new OmvDataSource({
			// baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
			baseUrl: 'https://vector.hereapi.com/v2/vectortiles/base/mc',
			authenticationCode: harp,
			authenticationMethod: {
				method: AuthenticationMethod.QueryString,
				name: 'apikey',
			},

			apiFormat: APIFormat.XYZOMV,
			styleSetName: 'tilezen',

			...(useWOrker
				? {}
				: {
						// This here! Set this to disable workers and make it load in the same thread (I
						// haven't noticed any performance issue on my slow intel i5 laptop).
						decoder: new OmvTileDecoder(),
				  }),
		})

		mapView.addDataSource(omvDataSource)
	})

	return (
		<>
			<canvas id="harpCanvas" ref={canvas}></canvas>

			<style jsx>{
				/*css*/ `
					#map {
						width: 100%;
						height: 50%;
						position: relative;
					}

					#map > * {
						position: absolute;
					}

					#harpCanvas {
						width: 100%;
						height: 100%;
						padding: 0;
						border: 0;
						display: block;
					}

					#msgs {
						width: 100%;
						height: 50%;
						position: relative;
					}
				`
			}</style>
		</>
	)
}
