# Enum Telemetry Toggle View
This simple plugin allows for telemetry configured for string based enumerations to be displayed as a box that is red/un-toggled when the value is considered bad or green/toggled when the value of considered good. 

## Usage
Create a new object of type `Toggle Switch`. You must provide a string for the name of the enumeration that is considered healthy. Edit the object and drag onto the object's view any telemetry objects that you wish to observe. Then simply watch as the toggles switch between red and green as the status of the telemetry changes. 

## Installation
If you are using my [OpenMCT Template](https://github.com/qkmaxware/openmct-template.git) simply clone this repo into `./plugins/openmct-toggleview` and add the following config to the server's package.json.
```diff
  "plugins": {
+    "toggleview": {
+      "client": "plugins/openmct-toggleview/plugin.js"
+    }
  },
```

If you are using a different installation of OpenMCT, first, include the plugin.js file into the index.html and install it the traditional way.
```diff
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title><%= name %> - <%= version %></title>
    <script src="openmct/openmct.js"></script>
    <link rel="icon" type="image/png" href="openmct/favicons/favicon-96x96.png" sizes="96x96" type="image/x-icon">
    <link rel="icon" type="image/png" href="openmct/favicons/favicon-32x32.png" sizes="32x32" type="image/x-icon">
    <link rel="icon" type="image/png" href="openmct/favicons/favicon-16x16.png" sizes="16x16" type="image/x-icon">

    <script src="static/lib/http.js"></script>
+    <script src="plugins/openmct-toggleview/plugin.js"></script>
</head>
<body>
    <script>
    ...
+    openmct.install(toggleview());

    openmct.start();
    </script>
</body>
```