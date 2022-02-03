// @ts-check
import {Template} from 'meteor/templating'
import {ReactiveVar} from 'meteor/reactive-var'

import {MapView} from '@here/harp-mapview'
import {GeoCoordinates} from '@here/harp-geoutils'
import {APIFormat, AuthenticationMethod, OmvDataSource} from '@here/harp-omv-datasource'
import {OmvTileDecoder} from '@here/harp-omv-datasource/index-worker'
import {MapControls, MapControlsUI} from '@here/harp-map-controls'

import './main.html'

Template.hello.onCreated(function helloOnCreated() {
	// counter starts at 0
	this.counter = new ReactiveVar(0)
})

Template.info.onRendered(() => {
	// withoutWorker();
	withWorker()
})

function withoutWorker() {
	const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('harpCanvas'))

	const mapView = new MapView({
		canvas,

		theme: 'https://unpkg.com/@here/harp-map-theme@0.13.0/resources/berlin_tilezen_base.json',

		/**
		 * This is the part I was confused with: ignore these options, instead
		 * set the 'decoder' option in the 'OmvDataSource', see below.
		 */
		// decoderUrl: "harp-gl-decoders.bundle.js",
		// decoderCount: 0,

		maxVisibleDataSourceTiles: 40,
		tileCacheSize: 100,
	})

	mapView.camera.position.set(0, 0, 800)
	mapView.geoCenter = new GeoCoordinates(40.70398928, -74.01319808, 0)
	mapView.resize(canvas.clientWidth, canvas.clientHeight)
	window.onresize = () => mapView.resize(canvas.clientWidth, canvas.clientHeight)

	const dataSource = new OmvDataSource({
		apiFormat: APIFormat.XYZOMV,
		styleSetName: 'tilezen',

		baseUrl: 'https://vector.hereapi.com/v2/vectortiles/base/mc',
		authenticationCode: 'C1EXOeTSbGd1UCgQjnrHCtIYRHAGdK64pVuWXvMZpuM',
		authenticationMethod: {
			method: AuthenticationMethod.QueryString,
			name: 'apikey',
		},

		// This here! Set this to disable workers and make it load in the same thread (I
		// haven't noticed any performance issue on my slow intel i5 laptop).
		decoder: new OmvTileDecoder(),
	})

	mapView.addDataSource(dataSource)

	MapControls.create(mapView)
}

function withWorker() {
	// import OmvTileDecoderService inside a web Worker with vanilla JS, thanks to
	// the JSPM ES Module CDN (https://jspm.io).
	const workerCode = `
        async function main() {
            const { OmvTileDecoderService } = (
                await import('https://dev.jspm.io/@here/harp-omv-datasource/index-worker')
            ).default

            OmvTileDecoderService.start()
        }

        main()
    `
	const blob = new Blob([workerCode], {type: 'application/javascript'})

	const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('harpCanvas'))

	const mapView = new MapView({
		canvas,

		// theme:
		//     "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_night_reduced.json",
		theme: 'https://unpkg.com/@here/harp-map-theme@0.13.0/resources/berlin_tilezen_base.json',

		decoderUrl: URL.createObjectURL(blob),

		//For tile cache optimization:
		maxVisibleDataSourceTiles: 40,
		tileCacheSize: 100,
	})

	// map.setCameraGeolocationAndZoom(
	//     new GeoCoordinates(1.278676, 103.850216),
	//     16
	// );
	mapView.camera.position.set(0, 0, 800)
	mapView.geoCenter = new GeoCoordinates(40.70398928, -74.01319808, 0)
	mapView.resize(canvas.clientWidth, canvas.clientHeight)
	window.onresize = () => mapView.resize(canvas.clientWidth, canvas.clientHeight)

	const mapControls = new MapControls(mapView)
	const ui = new MapControlsUI(mapControls, {
		projectionSwitch: true,
	})
	document.querySelector('#map').appendChild(ui.domElement)
	// mapControls.maxPitchAngle = 90;
	// mapControls.setRotation(6.3, 50);
	// mapControls.camera.rotation

	const omvDataSource = new OmvDataSource({
		// baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
		// authenticationCode: "5dQ9dU2HqI_GXmujeEcw-MyaogBB9XyNMeA72L47L7w"

		baseUrl: 'https://vector.hereapi.com/v2/vectortiles/base/mc',
		authenticationCode: 'C1EXOeTSbGd1UCgQjnrHCtIYRHAGdK64pVuWXvMZpuM',
		authenticationMethod: {
			method: AuthenticationMethod.QueryString,
			name: 'apikey',
		},

		apiFormat: APIFormat.XYZOMV,
		styleSetName: 'tilezen',
	})

	mapView.addDataSource(omvDataSource)
}

Template.hello.helpers({
	counter() {
		// @ts-ignore
		return Template.instance().counter.get()
	},
})

Template.hello.events({
	'click button'(event, instance) {
		// increment the counter when button is clicked
		instance.counter.set(instance.counter.get() + 1)
	},
})
