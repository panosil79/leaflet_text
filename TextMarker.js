/*
 * @class TextMarker
 * @aka L.TextMarker
 * @inherits Path
 *
 * A text of a fixed size with color specified in #RRGGBB and specified in pixels. Extends `Path`.
 */

L.TextMarker = L.Path.extend({

	// @section
	// @aka TextMarker options
	options: {
		fill: true,

		// @option size: Number = 12
		// Radius of the text marker, in pixels

		// @option size: Number = 12
		// Radius of the text marker, in pixels
		radius: 1000,
		size: 12,
		color: '#000000',
		text: ''
	},

	initialize: function (latlng, text, options) {
		L.setOptions(this, options);
		this._latlng = toLatLng(latlng);
		this._radius = this.options.radius
		this._size = this.options.size;
		this._color = this.options.color;
		this._text = text;
		console.info(this._color);

	},

	// @method setLatLng(latLng: LatLng): this
	// Sets the position of a text marker to a new location.
	setLatLng: function (latlng) {
		this._latlng = toLatLng(latlng);
		this.redraw();
		return this.fire('move', {latlng: this._latlng});
	},

	// @method getLatLng(): LatLng
	// Returns the current geographical position of the text marker
	getLatLng: function () {
		return this._latlng;
	},

	// @method setRadius(radius: Number): this
	// Sets the radius of a text marker. Units are in pixels.
	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	// @method getRadius(): Number
	// Returns the current radius of the text
	getRadius: function () {
		return this._radius;
	},

	setStyle : function (options) {
		var radius = options && options.radius || this._radius;
		Path.prototype.setStyle.call(this, options);
		this.setRadius(radius);
		return this;
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._updateBounds();
	},

	_updateBounds: function () {
		var r = this._radius,
		    r2 = this._radiusY || r,
		    w = this._clickTolerance(),
		    p = [r + w, r2 + w];
		this._pxBounds = new L.Bounds(this._point.subtract(p), this._point.add(p));
	},

	_update: function () {
		if (this._map) {
			this._updatePath();
		}
	},

	_updatePath: function () {
		
		if (!this._renderer._drawing || this._empty()) { return; }

		var p = this._point,
		    ctx = this._renderer._ctx;

		//this._renderer._drawnLayers[this._leaflet_id] = this;

		/*
		if (s !== 1) {
			ctx.save();
			ctx.scale(1, s);
		}*/

		ctx.font = this._size+"px Arial";
		ctx.fillStyle = this._color;
		ctx.textAlign = "left";
		ctx.fillText(this._text,p.x,p.y);

/*

		ctx.beginPath();
		ctx.arc(p.x, p.y / s, 50, 0, Math.PI * 2, false);


		if (s !== 1) {
			ctx.restore();
		}

		this._renderer._fillStroke(ctx, this);
*/

		//this._renderer._updateCircle(this);


	},

	_empty: function () {
		return !this._renderer._bounds.intersects(this._pxBounds);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p) {
		return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
	}





});


function toLatLng(a, b, c) {
	if (a instanceof L.LatLng) {
		return a;
	}
	if (isArray(a) && typeof a[0] !== 'object') {
		if (a.length === 3) {
			return new L.LatLng(a[0], a[1], a[2]);
		}
		if (a.length === 2) {
			return new L.LatLng(a[0], a[1]);
		}
		return null;
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
	}
	if (b === undefined) {
		return null;
	}
	return new L.LatLng(a, b, c);
}

var isArray = Array.isArray || function (obj) {
	return (Object.prototype.toString.call(obj) === '[object Array]');
};

// @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
// Instantiates a circle marker object given a geographical point, and an optional options object.
L.textMarker = function(latlng, text, options) {
	return new L.TextMarker(latlng, text, options);
}

