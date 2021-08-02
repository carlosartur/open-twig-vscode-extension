
# open-twig README
![](https://raw.githubusercontent.com/carlosartur/open-twig-vscode-extension/master/usage-animation/pjDrNBcZkN.gif)

The open-twig extension was made for working on Symfony projects where twig template calls aren't just the name of the twig file. It read the cache file of Symfony calls of twigs and opens the right file for you, doesn't matter the name of the template have in project.

It's perfect if your project uses namespaces for calling twigs, as seen in: https://symfony.com/doc/3.4/templating/namespaced_paths.html

## Features
Opens a twig reading it's location from Symfony's cache. 
Future versions will open the file from location if the template is not namespaced.

## Requirements
To make the extension work, you must put the settings on "settings.json" in your vscode:
```
"openTwig": {
	"templateFile": "your-relative-path-to-templates-cache-file.php"
},
```
If your template cache file is outside your project, make a symbolic link from this file from inside the project. Then, put the location on this setting.

## Extension Settings
This extension have this settings:

*  `openTwig.templateFile`: relative path of your templates namespacing cache.

*  `openTwig.regexes[][regex]`: add a regex to replace on your namespace for transform to twig file name.
*  `openTwig.regexes[][replace]`: text to replace the regex on setting above.

`openTwig.regexes` setting example, adding a setting to replace ":" to "/". you can add multiple regular expressions as you wish:

```
"openTwig": {
	"templateFile": "your-relative-path-to-templates-cache-file.php",
	"regexes": [
		{
			"regex": "\:", 
			"replace": "\/"
		}
	]
},
```
  
## Known Issues
If openTwig.templateFile is not set, null or false, the extension will not work.

If template cache file haven't the correct structure (is not generated automatically by symfony), the extension may not work properly.
  

## Release Notes
 

### 1.0.0
Initial release of open-twig.