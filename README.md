# t4Query
### TERMINALFOUR JavaScript layout processor superset

t4Query is a language superset for the [TERMINALFOUR](http://www.terminalfour.com/) JavaScript layout processor intended to simplify the inclusion of data in your content and page layouts. By pasting it into the top of your layout, you unlock easy access to all of your data normally included via t4 tags without needing extensive knowledge of the objects and methods available in the processor.

Including an image path turns from this:

```javascript
importClass(com.terminalfour.publish.utils.BrokerUtils);
BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Media Field" output="normal" modifiers="" formatter="path/*"  />');
```

Into this:

```javascript
$('Media Field').formatter('path/*').insert();
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

## Usage

### Inserting Content

### Selective Output

### Modifiers, Formatters, and Other Attributes

### Retrieving Metadata

### Checking Page Information
