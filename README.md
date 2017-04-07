# FileHeaderComment

This extension allow you to insert timestamp, copyright or any information to your file like comment below

	/*
	 * Created on Sun Aug 07 2016 14:6:41
	 *
	 * Copyright (c) 2016 - Your Company
	 */

## Features

- insert defined parameter like `date`, `time`, `datetime`, `year`, `company`
- insert your own parameter and template
- define multiple templates

## Install

	ext install fileheadercomment

## Extension Settings

By default you don't have to set anything. It will detect most programming language for appropriate comment syntax.

Execute it from `Command Pallete` (menu View - Command Pallete...) then type command below:

1. `FileHeaderComment: Insert Default Template at Cursor`
2. `FileHeaderComment: Select from Available Templates`

The second command will show your available templates defined in Settings

If you want to set your own parameter and template (set from menu Preferences - User Settings), you can read explanation below

This is default configuration

```
	"fileHeaderComment.parameter":{
		"*":{
			"commentbegin": "/*",
			"commentprefix": " *",
			"commentend": " */",
			"company": "Your Company"
		}
	},
	"fileHeaderComment.template":{
		"*":[
			"${commentbegin}",
			"${commentprefix} Created on ${date}",
			"${commentprefix}",
			"${commentprefix} Copyright (c) ${year} ${company}",
			"${commentend}"
		]
	}
```

Define all custom variables/paramenters in star `*` key like

```
"fileHeaderComment.parameter":{
	"*":{
		"company": "Your Company"
		"myvar1": "My Variable 1",
		"myvar2": "My Variable 2"
	}
}
```

Use your variable in template like (star sign `*` will be default template)

```
"fileHeaderComment.template":{
	"*":[
		"${commentbegin}",
		"${commentprefix} Created on ${date}",
		"${commentprefix}",
		"${commentprefix} Copyright (c) ${year} ${company}",
		"${commentprefix} my variables are ${myvar1} and ${myvar2}",
		"${commentend}"
	]
}
```
You can define multiple templates, for instance template for MIT License

```
"fileHeaderComment.parameter":{
	"*":{
		"author": "Your Name",
		"license_mit":[
			"The MIT License (MIT)",
			" Copyright (c) ${year} ${author}",
			"",
			" Permission is hereby granted, free of charge, to any person obtaining a copy of this software",
			" and associated documentation files (the \"Software\"), to deal in the Software without restriction,",
			" including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,",
			" and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,",
			" subject to the following conditions:",
			"",
			" The above copyright notice and this permission notice shall be included in all copies or substantial",
			" portions of the Software.",
			"",
			" THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED",
			" TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL",
			" THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,",
			" TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	}
},
"fileHeaderComment.template":{
	"mit":[
		"${commentbegin}",
		"${commentprefix} Created on ${date}",
		"${commentprefix}",
		"${commentprefix} ${license_mit}",
		"${commentend}"
	]
}
```
You can use your `mit` template above by calling it through 	`Command Pallete` and choose `FileHeaderComment: Select from Available Templates`.

You can use parameters below in your template

- `date` : print current date
- `time` : print current time
- `time24h` : print current time in 24 hour format
- `datetime`: print current date + time
- `datetime24h` : print current date + time in 24 hour format
- `company` : print "Your Company"
- `year`: print current year



## Release Notes

### 0.0.3
- fixing "unknown configuration setting" message in Settings

### 0.0.2
- multiple templates
- bugfixes
 
### 0.0.1

- Initial release