# FileHeaderComment

This extension allow you to insert timestamp, copyright or any information to your file like comment below

	/*
	 * Created on Tue Feb 18 2025
	 *
	 * Copyright (c) 2025 - Your Company
	 */

## Features

- insert defined variable like `date`, `time`, `datetime`, `day`, `month`, `month3`, `year`, `hour`, `minute`, `second`, `company`, `filename`, `workspacename`, `username`
- insert your own variable and template
- create variable from shell command output (experimental)
- create multiple templates

## Install

	ext install fileheadercomment

## Extension Settings

By default you don't have to set anything. It will detect most programming language for appropriate comment syntax.

Execute it from `Command Pallete` (menu View - Command Pallete...) then type command below:

1. `FileHeaderComment: Insert Default Template at Cursor`
2. `FileHeaderComment: Select from Available Templates`
3. `FileHeaderCOmment: Print All Variables`

These commands can also be accessed from the context menu.

The second command will display the available templates defined in Settings.
You can see all available variables using command number 3.

If you want to set your own variables and templates (set from the Preferences - User Settings menu), you can read the explanation below

This is default configuration

```json
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

Define all custom variables/parameters in asterisk `*` like

```json
"fileHeaderComment.parameter":{
	"*":{
		"company": "Your Company"
		"myvar1": "My Variable 1",
		"myvar2": "My Variable 2"
	}
}
```

You can create/override variables for specific file language, ie python

```json
"fileHeaderComment.parameter":{
	"*":{
		"company": "Your Company"
		"myvar1": "My Variable 1",
		"myvar2": "My Variable 2"
	},
	"python": {
		"commentbegin": "\"\"\"",
		"commentend": "\"\"\"",
		"commentprefix": ""
	}
}
```

(Experimental) You can get shell command output as a variable like

```json
"fileHeaderComment.parameter: {
	"myvar3": "cmd(ls -alh)"
}"
```
my_command inside `cmd(my_command)` i.e. `ls -alh` in the example above will be executed in the current file directory. It only captures the last line output of 255 characters.


Use your variable in template like (asterisk `*` will be default template)

```json
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

```json
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

You can use variables below in your template

- `company` : print "Your Company"
- `date` : print current date
- `time24h` : print current time in 24 hour format
- `datetime`: print current date + time
- `datetime24h` : print current date + time in 24 hour format
- `day`: print day of the month
- `filename`: print filename,
- `hour`: print current hour (24h)
- `minute`: print current minute
- `month`: print current month
- `month3`: first-3 letters of the month, e.g "Mar"
- `now`: same as datetime
- `now24h`: same as datetime24h
- `second`: print current second
- `time` : print current time
- `time24h`: print current time in 24 hour format
- `username`: user name
- `weeknumber` : print week number,
- `workspacename`: workspace name,
- `year`: print current year
- `yearshort`: print 2 digit of current year



## Release Notes
### 0.0.6
- variable for specific file language
- add month3 (thanks to @kfsone)
- add workspacename (thanks to @ljahier)
- add username (thanks to @mosayyeb-ebrahimi)
- add context menu (thanks to @bwilliams-sequence)
- custom variable from shell command output

### 0.0.5
- fixing python comment style (thanks to @ronak1009)

### 0.0.4
- support yaml, shellscript language (thanks to @waddyvic)
- add day, month, hour, minute, second, filename variables (thanks to @rcabg, @ternvein)

### 0.0.3
- fixing "unknown configuration setting" message in Settings (thanks to @isuda)

### 0.0.2
- multiple templates
- bugfixes
 
### 0.0.1
- Initial release
