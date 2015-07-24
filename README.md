<center>![t4_query](https://cloud.githubusercontent.com/assets/5970137/8856790/a6c554d6-3132-11e5-869b-70784d9b26f7.png)</center>
### <center>TERMINALFOUR JavaScript layout processor superset</center>

t4Query is a language superset for the [TERMINALFOUR](http://www.terminalfour.com/) JavaScript layout processor intended to simplify the inclusion of data in your content and page layouts. By pasting it into the top of your layout, you unlock easy access to all of your data normally included via t4 tags without needing extensive knowledge of the objects and methods available in the processor.

Including an image path turns from this:

```javascript
importClass(com.terminalfour.publish.utils.BrokerUtils);
BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Media Field" output="normal" modifiers="" formatter="path/*"  />');
```

Into this:

```javascript
$('Media Field').formatter('path/*')
```

Determining if a checkbox is checked turns from this:

```javascript
if (!content.get('Checkbox Field').publish().isEmpty()) ...
```

Into this:

```javascript
if ($('Checkbox Field').checked()) ...
```

t4Query focuses on making a human-readable content layout by sharing the vocabulary of the t4 tags you're already used to and providing simple, semantic methods that do what you'd expect. No installation or additional access necessary.

## Preparation

Open a content or page layout (e.g. text/html), switch to the JavaScript layout processor, then paste the contents of either [t4Query.js](https://github.com/userexec/t4Query/blob/master/t4Query.js) or [t4Query.min.js](https://github.com/userexec/t4Query/blob/master/t4Query.min.js) into the top of the input box. Create your content layout below the included code.

## Usage

t4Query uses a "selector-modifiers(s)" pattern for the majority of its use cases. You begin by selecting a field from your content type's element list, apply any modifiers that would normally be applied in a t4 tag to retrieve the desired output. This pattern will generally appear within a `document.write` statement in order to output content to the page.

Selector | Modifier | Modifier ...
------------ | ------------- | -------------
$('*field name*') | .*t4-tag-attribute*('*value*') | .*t4-tag-attribute*('*value*') ...

Some exceptions to this pattern exist, such as retrieving section and page metadata or including navigation objects.

In some uncommon cases in which \[object Object\] is returned, the pattern may require the `insert` method to be chained onto the end to resolve its content (e.g. `$('Field').modifiers('striptags').insert()`). The `valueOf` and `toString` methods of every t4Query object are linked to its insert method, so insertion occurs automatically in most use cases. Read more about how this works at [Medium](https://medium.com/@kevincennis/object-object-things-you-didn-t-know-about-valueof-38f2a88dfb33) for a better understanding of when `insert` may need to be appended.

- [Inserting Content](#inserting)
- [Selective Output](#selective)
- [Modifiers, Formatters, and Other Attributes](#modifiers)
- [Retrieving Metadata](#metadata)
- [Navigation Objects](#navigation)
- [Checking Page Information](#pageinfo)
- [Using Plain t4 Tags](#tags)

### <a name="inserting"></a> Inserting Content

To insert content into your page, first open a `document.write` and then select the field you wish to include using the selector-modifier(s) syntax.

```javascript
document.write('The secret message is: ' + $('Secret Message') + '...');
```

### <a name="selective"></a> Selective Output

To check if a field has content, select it and use the `hasContent` method. Combining this with an if statement emulates selective output.

```javascript
if ($('Email Address').hasContent()) {
	document.write('<li><a href="mailto:' + $('Email Address') + '">Email user</a></li>');
}
```

This method can be used for checkboxes as well, or you can use the more semantic `checked` method:

```javascript
if ($('Hide Buttons').checked()) {
	document.write('<style> div.button { display: none; } </style>');
}
```

### <a name="modifiers"></a> Modifiers, Formatters, and Other Attributes

t4Query's selector function is designed to be transformed via chaining methods. Each of the most common attributes you would include on a t4 tag can be applied to your selected field before its insertion, allowing you to transform the data that will be returned.

Get an image path:

```javascript
document.write('Path: ' + $('Media Field').formatter('path/*'));
```

Strip HTML tags and convert special characters:

```javascript
document.write('Plain text: ' + $('Mixed Field').modifiers('striptags, htmlentities'));
```

Use a special output format:

```javascript
document.write('Image (image output): ' + $('Image Field').output('image'));
```

Any number of the following methods can be chained between the selector and the insertion:

- `action`
- `after`
- `appendContent`
- `appendElement`
- `before`
- `dateFormat`
- `delimiter`
- `disableDirectEdit` (no argument needed)
- `displayField`
- `element`
- `format`
- `formatModifiers`
- `formatter`
- `id`
- `locale`
- `localeEs`
- `meta`
- `method`
- `modifiers`
- `name`
- `output`
- `outputSheetName`
- `processFormat`
- `text`
- `textualNameSeparator`
- `type`
- `url`

If you need to specify an uncommon attribute for the content to be included, use the general purpose `attr` method with a key-value pair:

```javascript
document.write('Uncommon format: ' + $('Field').attr('uncommon', 'true'));
```

### <a name="metadata"></a> Retrieving Metadata

To retrieve metadata, you'll use a slightly different syntax. Pass the name of any metadata field to the `meta` method without specifying a selector:

```javascript
document.write('Last Modified: ' + $.meta('last_modified'));
```

Supported metadata fields:
- content_id
- expiry_date
- html_anchor
- last_modified
- last_modified_by_fullname
- last_modified_by_username
- publish_date
- recently_modified
- version
- filesize (see below)

The filesize metadata requires a modifier since it needs to know which element to examine. You can use the `attr` method with a key-value pair to specify the element.

```javascript
document.write('Last Modified: ' + $.meta('last_modified').attr('name', 'Text Field'));
```


### <a name="navigation"></a> Navigation Objects

Including a navigation object is as simple as finding its ID, then using the following pattern to insert it onto the page:

```javascript
document.write('Nav object #104: ' + $.nav(104));
```

### <a name="pageinfo"></a> Checking Page Information

Page information is not a primary focus of t4Query, but some page information can assist in layouts. Currently t4Query only has the ability to check the page layout of the section the content item appears in. This can be *extremely* useful for outputting different HTML structures for different page layouts that must all support the text/html content layout. Note that if the content item is pulled through a navigation tag, it will report the layout ID of the page on which it originally resides, not the page it's being pulled onto.

To find the page layout ID, use the following pattern:

```javascript
if ($.pageInfo('layout') == 121) {
	document.write('This is HTML for layout A');
} else if ($.pageInfo('layout') == 125) {
    document.write('This is HTML for layout B');
} else {
	document.write('This is compatible HTML for old templates');
}
```

### <a name="tags"></a> Using Plain t4 Tags

Maybe all of this new-fangled stuff isn't for you. Maybe you just want the comfort of pasting in a t4 tag from the tag builder. That's okay--there's something for you here, too:

```javascript
document.write('Plain text: ' + $.t4('<t4 output="normal" name="Text Field" modifiers="" />'));
```
