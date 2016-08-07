# FileHeaderComment

This extension allow you to insert timestamp, copyright or any information to your file like comment below

	/*
	 * Created on Sun Aug 07 2016 14:6:41
	 *
	 * Copyright (c) 2016 - Your Company
	 */

## Features

- insert defined parameter like `date`, `time`, `datetime`, `year`, `company`
- insert your own parameter
- define template and parameter for each programming language

## Install

	ext install fileheadercomment

## Extension Settings

By default you don't have to set anything. It will detect most programming language for appropriate comment syntax.

Execute it from `Command Pallete` (menu View - Command Pallete...) then type `FileHeaderComment: Insert Comment at Cursor`

If you want to set your own parameter and template (set from menu Preferences - User Settings on osx), you can read explanation below

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

custom variable

	"fileHeaderComment.parameter":{
		"*":{
			"commentbegin": "/*",
			"commentprefix": " *",
			"commentend": " */",
			"company": "Your Company",
			"myvar1": "My Variable 1",
			"myvar2": "My Variable 2"
		}
	}

use your variable in template like

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


You can set different parameter for specific programming language

	"fileHeaderComment.parameter":{
		"*": {
			...
		},
		"php":{
			"commentbegin": "//",
			"commentprefix": "//",
			"commentend": "//",
			"company": "Your Company"
		}
	}

Parameter defined in extension

- `date` : current date
- `time` : current time
- `time24h` : current time in 24 hour format
- `datetime`: current date + time
- `datetime24h` : current date + time in 24 hour format
- `company` : Your Company
- `year`: current year

### Example of template with MIT License

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
		"*":[
			"${commentbegin}",
			"${commentprefix} Created on ${date}",
			"${commentprefix}",
			"${commentprefix} ${license_mit}",
			"${commentend}"
		]
	}

## Release Notes


### 0.0.1

Initial release