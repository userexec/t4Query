///////////////////////////////////////////////////////////////////////////////
///// t4Query - T4 JavaScript Preprocessor superset ///////////////////////////
///// v1.0                                         ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/* global document, content, publishCache, dbStatement, section, language, isPreview, importClass, com, BrokerUtils */
/* jshint evil: true */
/* jshint strict: false */
/* jshint eqeqeq: false */

if (typeof $ == 'undefined') {
	// Import Broker Utilities
	importClass(com.terminalfour.publish.utils.BrokerUtils);

	// Define the common content selector function
	var $ = function(field) {
		var t4Obj;
		if (content.get(field).publish() !== null) {
			t4Obj = $.createObject({
					name: field,
					type: 'content',
					output: 'normal'
				});

			if (content.get(field).publish().isEmpty()) {
				t4Obj.empty = true;
			}

			return t4Obj;
		} else {
			// Element is null. Create a dummy t4 object for a silent fail of chained actions.
			t4Obj = $.createObject({
					name: field,
					type: 'content',
					output: 'normal'
				});

			// Include a flag so that insert() can avoid sending this object to the broker utils
			t4Obj.fail = true;

			// Log a warning in the page output
			document.write('<br><span style="color: red; font-weight: bold;">tQuery warning:</span> Field ' + field + ' returned null.<br>');

			return t4Obj;
		}
	};

	// Provide mechanism for processing T4 tags
	$.t4 = function(tag) {
		return BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag);
	};

	// Provide helper mechanism for creating generic tQuery objects
	$.createObject = function(keyValuePairs) {
		// Create a new tQuery object
		var element = new $.Functions();

		// Load the tag object with the requested key-value pairs
		element.tag = {};
		for (var key in keyValuePairs) {
			element.tag[key] = keyValuePairs[key];
		}
		element.empty = false;
		element.fail = false;

		return element;
	};

	// Provide mechanism for outputting metadata
	$.meta = function(prop) {
		return $.createObject({
			meta: prop,
			type: 'meta'
		});
	};

	// Define standard library of tag-forming functions
	$.Functions = function() {
		return {
			action: function(str) {
				return this.attr('action', str);
			},
			after: function(str) {
				return this.attr('after', str);
			},
			appendContent: function(str) {
				return this.attr('append-content', str);
			},
			appendElement: function(str) {
				return this.attr('append-element', str);
			},
			attr: function (attribute, str) {
				// Ensure that only strings are added to tag attributes
				if (typeof str == 'string') {
					// Store the new attribute and value in the tag object
					this.tag[attribute] = str;
					return this;
				} else {
					return false;
				}
			},
			before: function(str) {
				return this.attr('before', str);
			},
			checked: function() {
				return !this.empty;
			},
			dateFormat: function(str) {
				return this.attr('date_format', str);
			},
			delimiter: function(str) {
				return this.attr('delimiter', str);
			},
			disableDirectEdit: function() {
				return this.attr('enable-dedit', 'false');
			},
			displayField: function(str) {
				return this.attr('display_field', str);
			},
			element: function(str) {
				return this.attr('element', str);
			},
			format: function(str) {
				return this.attr('format', str);
			},
			formatter: function(str) {
				return this.attr('formatter', str);
			},
			formatModifiers: function(str) {
				return this.attr('format-modifiers', str);
			},
			hasContent: function() {
				return this.checked();
			},
			id: function(str) {
				return this.attr('id', str);
			},
			insert: function() {
				if (!this.fail) {
					// Build a t4 tag from the tag object
					// Opening bracket is omitted to prevent preemptive processing of tags not requiring broker utils
					var tag = 't4 ';
					for (var key in this.tag) {
						tag += key + '="' + this.tag[key] + '" ';
					}
					tag += '/>';

					// Use Broker Utils to parse the t4 tag and insert onto the page
					// Add opening bracket as tag is passed to broker utils to prevent preemptive processing
					return $.t4('<' + tag);
				} else {
					// Dummy object detected--fail silently
					return false;
				}
			},
			locale: function(str) {
				return this.attr('locale', str);
			},
			localeEs: function(str) {
				return this.attr('locale_es', str);
			},
			meta: function(str) {
				return this.attr('meta', str);
			},
			method: function(str) {
				return this.attr('method', str);
			},
			modifiers: function(str) {
				/* medialibrary, nav_sections, striptags, htmlentities, nl2br, js-var, rssentities, encode_emails */
				return this.attr('modifiers', str);
			},
			name: function(str) {
				return this.attr('name', str);
			},
			output: function(str) {
				return this.attr('output', str);
			},
			outputSheetName: function(str) {
				return this.attr('output-sheet-name', str);
			},
			processFormat: function(str) {
				// Force option to string
				if (str) {
					str = 'true';
				} else {
					str = 'false';
				}
				return this.attr('process-format', str);
			},
			text: function(str) {
				return this.attr('text', str);
			},
			textualNameSeparator: function(str) {
				return this.attr('textual-name-separator', str);
			},
			type: function(str) {
				return this.attr('type', str);
			},
			url: function(str) {
				return this.attr('url', str);
			},
			valueOf: function() {
				return this.insert();
			}
		};
	};
}

///////////////////////////////////////////////////////////////////////////////
///// End of t4Query - Create your content layout below ///////////////////////
///////////////////////////////////////////////////////////////////////////////