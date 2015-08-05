///////////////////////////////////////////////////////////////////////////////
///// t4Query - T4 JavaScript Preprocessor superset ///////////////////////////
///// v1.03                                         ///////////////////////////
///////////////////////////////////////////////////////////////////////////////

/* global document, content, publishCache, dbStatement, section, language, isPreview, importClass, com, BrokerUtils */
/* jshint evil: true */
/* jshint strict: false */

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
				t4Obj.toString = function() { return ''; };
				t4Obj.valueOf = function() { return 0; };
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

			// Tag this object as empty
			t4Obj.empty = true;
			t4Obj.toString = function() { return ''; };
			t4Obj.valueOf = function() { return 0; };

			return t4Obj;
		}
	};

	// Provide a shortcut with newline to document.write
	$.w = function(str, indent) {
		var tabs = '';
		if (typeof indent == 'number') {
			for (var i = 0; i < Math.floor(indent); i++) {
				tabs += '\t';
			}
		}
		document.write(tabs + str + '\n');
	};

	// Provide mechanism for processing T4 tags
	$.t4 = function(tag) {
		return BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag);
	};

	// Provide helper mechanism for creating generic t4Query objects
	$.createObject = function(keyValuePairs) {
		// Create a new t4Query object
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

	// Provide mechanism for outputting navigation
	$.nav = function(id) {
		return $.createObject({
			id: id + '',
			type: 'navigation'
		});
	};

	// Provide mechanism for outputting page info
	$.pageInfo = function(prop) {
		if (typeof $.pageInfo[prop] == 'function') {
			return $.pageInfo[prop]();
		}
	};

	$.pageInfo.layout = function() {
		// Find the layout ID of the page on which this content item appears
		var channel = publishCache.getChannel();
		// Return the style of the secion (channel object required for lookup)
		return section.getStyle(channel);
	};

	// Define standard library of tag-forming functions
	$.Functions = function() {
		this.valueOf = function() {
			return this.insert();
		};
		this.toString = function() {
			return this.insert();
		};
	};

	// Static prototypal methods for t4Query objects
	$.Functions.prototype.action = function(str) {
		return this.attr('action', str);
	};
	$.Functions.prototype.after = function(str) {
		return this.attr('after', str);
	};
	$.Functions.prototype.appendContent = function(str) {
		return this.attr('append-content', str);
	};
	$.Functions.prototype.appendElement = function(str) {
		return this.attr('append-element', str);
	};
	$.Functions.prototype.attr = function (attribute, str) {
		// Ensure that only strings are added to tag attributes
		if (typeof str == 'string') {
			// Store the new attribute and value in the tag object
			this.tag[attribute] = str;
			return this;
		} else {
			// Flag this t4Query object so that it does not pass through broker utils
			this.fail = true;

			// Log a warning in the page output
			document.write('<br><span style="color: red; font-weight: bold;">t4Query warning:</span> Passed attribute ' + str + ' should be a string.<br>');
			return false;
		}
	};
	$.Functions.prototype.before = function(str) {
		return this.attr('before', str);
	};
	$.Functions.prototype.checked = function() {
		return !this.empty;
	};
	$.Functions.prototype.dateFormat = function(str) {
		return this.attr('date_format', str);
	};
	$.Functions.prototype.delimiter = function(str) {
		return this.attr('delimiter', str);
	};
	$.Functions.prototype.disableDirectEdit = function() {
		return this.attr('enable-dedit', 'false');
	};
	$.Functions.prototype.displayField = function(str) {
		return this.attr('display_field', str);
	};
	$.Functions.prototype.element = function(str) {
		return this.attr('element', str);
	};
	$.Functions.prototype.format = function(str) {
		return this.attr('format', str);
	};
	$.Functions.prototype.formatter = function(str) {
		return this.attr('formatter', str);
	};
	$.Functions.prototype.formatModifiers = function(str) {
		return this.attr('format-modifiers', str);
	};
	$.Functions.prototype.hasContent = function() {
		return this.checked();
	};
	$.Functions.prototype.id = function(str) {
		return this.attr('id', str);
	};
	$.Functions.prototype.insert = function() {
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
			return '' + $.t4('<' + tag);
		} else {
			// Flagged object detected--fail silently
			return false;
		}
	};
	$.Functions.prototype.locale = function(str) {
		return this.attr('locale', str);
	};
	$.Functions.prototype.localeEs = function(str) {
		return this.attr('locale_es', str);
	};
	$.Functions.prototype.meta = function(str) {
		return this.attr('meta', str);
	};
	$.Functions.prototype.method = function(str) {
		return this.attr('method', str);
	};
	$.Functions.prototype.modifiers = function(str) {
		/* medialibrary, nav_sections, striptags, htmlentities, nl2br, js-var, rssentities, encode_emails */
		return this.attr('modifiers', str);
	};
	$.Functions.prototype.name = function(str) {
		return this.attr('name', str);
	};
	$.Functions.prototype.output = function(str) {
		return this.attr('output', str);
	};
	$.Functions.prototype.outputSheetName = function(str) {
		return this.attr('output-sheet-name', str);
	};
	$.Functions.prototype.processFormat = function(str) {
		// Force option to string
		if (typeof str !== 'string' && str) {
			str = 'true';
		} else {
			str = 'false';
		}
		return this.attr('process-format', str);
	};
	$.Functions.prototype.text = function(str) {
		return this.attr('text', str);
	};
	$.Functions.prototype.textualNameSeparator = function(str) {
		return this.attr('textual-name-separator', str);
	};
	$.Functions.prototype.type = function(str) {
		return this.attr('type', str);
	};
	$.Functions.prototype.url = function(str) {
		return this.attr('url', str);
	};
}

///////////////////////////////////////////////////////////////////////////////
///// End of t4Query - Create your content layout below ///////////////////////
///////////////////////////////////////////////////////////////////////////////