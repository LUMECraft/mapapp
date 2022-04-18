// @ts-check
import {Accessor, createEffect, createSignal, onCleanup, onMount} from 'solid-js'
import {MapView} from '@here/harp-mapview'
import {GeoCoordinates, sphereProjection} from '@here/harp-geoutils'
import {APIFormat, AuthenticationMethod, OmvDataSource} from '@here/harp-omv-datasource'
import {OmvTileDecoder} from '@here/harp-omv-datasource/index-worker'
import {MapControls, MapControlsUI} from '@here/harp-map-controls'

import {harp} from '../../imports/keys'

export function Harp() {
	let canvas!: HTMLCanvasElement
	let map!: HTMLDivElement

	const [mapSize, setMapSize] = createSignal<ResizeObserverEntry>()

	onMount(() => {
		const useWorker = true

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

			// theme: '/harp-themes/berlin_tilezen_base.json',
			// theme: '/harp-themes/berlin_tilezen_night_reduced.json',
			theme: '/harp-themes/berlin_tilezen_effects_outlines.json',

			...(useWorker
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

		// These two APIs are roughly the same, one uses meter distance, one uses zoom level.
		mapView.lookAt(new GeoCoordinates(40.70398928, -74.01319808), 2_000_000)
		// mapView.setCameraGeolocationAndZoom(new GeoCoordinates(40.70398928, -74.01319808), 14)

		mapView.resize(canvas.clientWidth, canvas.clientHeight)

		createEffect(() => {
			const size = mapSize()
			if (!size) return
			mapView.resize(size.target.clientWidth, size.target.clientHeight)
		})

		let defaultControls = false

		if (defaultControls) {
			MapControls.create(mapView)
		} else {
			const mapControls = new MapControls(mapView)

			const ui = new MapControlsUI(mapControls, {
				projectionSwitch: true,
			})

			map.appendChild(ui.domElement)
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

			...(useWorker
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
			<div ref={map} use:onresize={setMapSize}>
				<canvas ref={canvas}></canvas>
			</div>

			<style jsx>{
				/*css*/ `
					div {
						width: 100%;
						height: 100%;
						position: relative;
					}

					div > * {
						position: absolute;
					}

					canvas {
						width: 100%;
						height: 100%;
						padding: 0;
						border: 0;
						display: block;
					}
				`
			}</style>
		</>
	)
}

type ResizeDirectiveArg = (size: ResizeObserverEntry) => void

function onresize(el: HTMLElement, arg: Accessor<ResizeDirectiveArg>) {
	const setSize = arg()
	const observer = new ResizeObserver(records => setSize(records[records.length - 1]))
	observer.observe(el)
	onCleanup(() => observer.disconnect())
}

declare module 'solid-js' {
	namespace JSX {
		interface Directives {
			onresize: ResizeDirectiveArg
		}
	}
}
