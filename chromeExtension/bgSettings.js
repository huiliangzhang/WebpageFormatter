var syncContentScript = function() {
	chrome.tabs.query({currentWindow: true}, function(tabs) {
	  tabs.forEach(function(x){
		chrome.tabs.sendMessage(x.id, {messageType:'updateSettings', value:settings});
	  });
	});	
}

var settings;
settings = JSON.parse(localStorage.getItem('settings'));
if(!settings)
{
  settings = {running: true, version:1, starttab:'tools'};
}
if(!settings.favlinks)
{
  settings.favlinks={};
  settings.favlinks.customlinks=[
    {title:'Facebook', value:'https://www.facebook.com'},
    {title:'Google', value:'https://www.google.com'},
    {title:'Yahoo', value:'https://www.yahoo.com'}
  ];
}
if(!settings.autorun)
{
  settings.autorun={running: true};
  settings.autorun.customcodes =[
        {
            "id": "x-001",
            "activated": true,
            "name": "Image resizer",
            "describe": "Hold Activation Key and move mouse on an image to show popup. Use mouse wheel to resize.",
            "websites": ".*",
            "script": "/*\n\tAuro Run code is passed to Webpage Formatter as an object\n    The object should be a function object\n    activate() function is the starting point.\n*/\nfunction autoRun() {\n\tthis.enlarging={src:'', ratio:1, pageX:0, pageY:0};\n\tthis.enlargingElement = document.createElement('img');\n\tthis.enlargingElement.style.position='absolute';\n\tthis.enlargingElement.style['z-index']=999;\n}\nautoRun.prototype = {\n    activate: function(settings){\n        //TODO: implement your logic here.\n        this.settings=settings;\n        \n\t\tif(!this.eventHandles)\n\t\t{\n\t\t\tthis.eventHandles={mousemove:this.func_mousemove.bind(this), mousewheel:this.func_mousewheel.bind(this)};\n\t\t\tdocument.addEventListener('mousemove', this.eventHandles.mousemove);\n\t\t\tdocument.addEventListener('mousewheel', this.eventHandles.mousewheel);\n\t\t}\n        \n    },    \n    deactivate: function(){\n        if(this.eventHandles)\n        {\n            document.removeEventListener('mousemove', this.eventHandles.mousemove);\n            document.removeEventListener('mousewheel', this.eventHandles.mousewheel);\n            this.eventHandles=null;\n        }\n        \n    },\n\tisActivated: function(e) {\n        if((this.settings.activationKey == 'shift' && e.shiftKey) ||\n           (this.settings.activationKey == 'alt' && e.altKey) ||\n           (this.settings.activationKey == 'meta' && e.metaKey) ||\n           (this.settings.activationKey == 'control' && e.ctrlKey))\n        {\n            return true;\n        }\n\n        return false;\n    },   \n    remove_enlargingElement: function() {\n        if(!this.enlarging.src)\n            return;\n        document.body.removeChild(this.enlargingElement);\n        this.enlarging.src=null;\n    },\n    decide_position: function(width, height) {\n        var doc = document.documentElement;\n        var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);\n        var scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);\n        var toLeft=this.enlarging.pageX-scrollLeft;\n        var toTop=this.enlarging.pageY-scrollTop;\n        var toRight=window.innerWidth-toLeft;\n        var toBottom=window.innerHeight-toTop;\n\n        var positionLeft=this.enlarging.pageX, positionTop=this.enlarging.pageY;\n        if(width<=toLeft)\n        {\n            positionLeft=this.enlarging.pageX-width;\n        }\n        else if(width>toRight)\n        {\n            if(toLeft>toRight || width>=window.innerWidth)\n            {\n                positionLeft=scrollLeft;\n            }\n            else\n            {\n                positionLeft=scrollLeft+window.innerWidth-width;\n            }\n        }\n\n        if(height<=toTop)\n        {\n            positionTop=this.enlarging.pageY-height;\n        }\n        else if(height>toBottom)\n        {\n            if(toTop>toBottom || height>=window.innerHeight)\n            {\n                positionTop=scrollTop;\n            }\n            else\n            {\n                positionTop=scrollTop+window.innerHeight-height;\n            }\n        }\n\n        this.enlargingElement.style.left=positionLeft+'px';\n        this.enlargingElement.style.top=positionTop+'px';\n    },\n    insert_enlargingElement: function(src, pageX, pageY, width, height){\n        if(!src || height<=0 || width<=0)\n            return;\n\n        this.enlarging.src=src;\n        this.enlarging.ratio=width/height;\n        this.enlarging.pageX=pageX;\n        this.enlarging.pageY=pageY;\n        this.enlargingElement.src=src;\n        this.enlargingElement.style.width='';\n\n        if(width>=window.innerWidth || height>=window.innerHeight)\n        {\n            if(this.enlarging.ratio<window.innerWidth/window.innerHeight)\n            {\n                height=window.innerHeight;\n                width=height*this.enlarging.ratio;\n            }\n            else\n            {\n                width=window.innerWidth;\n                height=width/this.enlarging.ratio;\n            }\n\n            this.enlargingElement.style.width=width+'px';\n        }\n\n        this.decide_position(width, height);\n        document.body.appendChild(this.enlargingElement);\n    },\n    func_mousemove: function(e){\n        if(!this.isActivated(e))\n        {\n            if(this.enlarging.src)\n            {\n                this.remove_enlargingElement();\n            }\n            return;\n        }\n\n        var target = e.target;\n        if(target.tagName.toLowerCase()=='img' && target.src)\n        {\n            var src=target.src;\n            if(src!=this.enlarging.src)\n            {\n                this.remove_enlargingElement();\n\n                this.insert_enlargingElement(src, e.pageX, e.pageY, target.naturalWidth, target.naturalHeight);\n            }\n        }\n        else\n        {\n            this.remove_enlargingElement();\n        }\n    },\n    func_mousewheel: function(e){\n        if(!this.enlarging.src)\n            return;\n\n        e.preventDefault();\n        e.stopImmediatePropagation();\n\n        var width = this.enlargingElement.offsetWidth + e.wheelDeltaY;\n        this.enlargingElement.style.width=width+'px';\n        var height=width/this.enlarging.ratio;\n\n        this.decide_position(width, height);\n    }\n        \n}\n\n//Resiger the Auto Run\nautoRuns.push(new autoRun());\n\n",
            "author": "system",
            "version": "1.0",
            "parameters": [
                {
                    "name": "activationKey",
                    "title": "Activation Key",
                    "type": "string",
                    "renderas": "radio",
                    "options": [
                        {
                            "title": "ALT",
                            "value": "alt",
                            "describe": "OPTION key on a Mac machine"
                        },
                        {
                            "title": "CONTROL",
                            "value": "control",
                            "describe": ""
                        },
                        {
                            "title": "META",
                            "value": "meta",
                            "describe": "May not be available on Windows"
                        },
                        {
                            "title": "SHIFT",
                            "value": "shift",
                            "describe": ""
                        }
                    ],
                    "value": "control",
                    "describe": "Hold the Activation Key and move mouse on an image to show popup. Use mouse wheel to resize."
                }
            ]
        },
        {
            "id": "x-002",
            "activated": false,
            "name": "Click to hide",
            "describe": "Hold Activation Key and click on webpage to hide the selected section.",
            "websites": ".*",
            "script": "/*\n\tAuro Run code is passed to Webpage Formatter as an object\n    The object should be a function object\n    activate() function is the starting point.\n*/\nfunction autoRun() {\n    //Create CSS\n    var style = document.createElement('style');\n    style.type = 'text/css';\n    style.innerHTML = ' .zhl_hovering {  -webkit-box-shadow:inset 0px 0px 0px 10px green;  -moz-box-shadow:inset 0px 0px 0px 10px green;  box-shadow:inset 0px 0px 0px 10px green;  }  .zhl_disappearing {  visibility: hidden;  } ';\n    document.body.appendChild(style);\n    \n    this.last_hover_element=null;\n\tthis.disappearing_elements=[];\n\tthis.last_click=0;\n\tthis.originalTitle='';\n\tthis.styleClasses = {\n    \thoving:' zhl_hovering',\n    \tdisappearing:' zhl_disappearing'\n    };\n\n}\nautoRun.prototype = {\n    activate: function(settings){\n        //TODO: implement your logic here.\n        this.settings=settings;\n        \n    \tif(!this.eventHandles)\n    \t{\n            this.eventHandles={mousemove:this.func_mousemove.bind(this), click:this.func_document_click.bind(this)};\n        \tdocument.addEventListener('mousemove', this.eventHandles.mousemove);\n        \tdocument.addEventListener('click', this.eventHandles.click);\n        }        \n        \n    },    \n    deactivate: function(){\n        if(this.eventHandles)\n        {\n            document.removeEventListener('mousemove', this.eventHandles.mousemove);\n            document.removeEventListener('click', this.eventHandles.click);\n            this.eventHandles=null;\n            this.func_show_all();\n        }\n    },\n\tisActivated: function(e) {\n        if((this.settings.activationKey == 'shift' && e.shiftKey) ||\n           (this.settings.activationKey == 'alt' && e.altKey) ||\n           (this.settings.activationKey == 'meta' && e.metaKey) ||\n           (this.settings.activationKey == 'control' && e.ctrlKey))\n        {\n            return true;\n        }\n\n        return false;\n    },\n    removeclass: function(element, name){\n\t\tif(element && element.className && element.className.indexOf && element.className.indexOf(this.styleClasses[name])!=-1)\n\t\t{\n\t\t\telement.className = element.className.replace(this.styleClasses[name], '');\n\t\t\tfor(var i=0; i<element.childNodes.length; i++)\n\t\t\t{\n\t\t\t\tthis.removeclass(element.childNodes[i], name);\n\t\t\t}\n\t\t}\n\t},\n\taddclass: function(element, name){\n\t\tif(element && element.className && element.className.indexOf && element.className.indexOf(this.styleClasses[name])!=-1)\n\t\t{\n\t\t\treturn;\n\t\t}\n\t\tif(!element.className)\n\t\t{\n\t\t\telement.className='';\n\t\t}\n\t\telement.className += this.styleClasses[name];\n\n\t\tfor(var i=0; i<element.childNodes.length; i++)\n\t\t{\n\t\t\tthis.addclass(element.childNodes[i], name);\n\t\t}\n\t},\n\tfunc_mousemove: function(e){\n\t\tif(!this.isActivated(e))\n\t\t{\n\t\t\tthis.removeclass(this.last_hover_element, 'hoving');\n\t\t\tthis.last_hover_element = null;\n\t\t\treturn;\n\t\t}\n\n\t\tvar target = e.target;\n\t\tif(this.last_hover_element != target)\n\t\t{\n\t\t\tthis.removeclass(this.last_hover_element, 'hoving');\n\t\t\tthis.addclass(target, 'hoving');\n\t\t\tthis.last_hover_element = target;\n\t\t}\n\t},\n\tfunc_document_click: function(e){\n\t\tif(!this.isActivated(e))\n\t\t{\n\t\t\treturn;\n\t\t}\n\t\te.preventDefault();\n\t\te.stopImmediatePropagation();\n\n\t\tvar now=new Date().getTime();\n\t\tif(now - this.last_click <= 500)\n\t\t{\n\t\t\tthis.func_show_all();\n\t\t\treturn;\n\t\t}\n\t\tthis.last_click=now;\n\n\t\tif(this.settings.titleName)\n\t\t{\n\t\t\tif(!this.originalTitle)\n\t\t\t{\n\t\t\t\tthis.originalTitle = document.title;\n\t\t\t}\n\t\t\tdocument.title = this.settings.titleName;\n\t\t}\n\n\t\tvar target = e.target;\n\t\tthis.addclass(target, 'disappearing');\n\t\tthis.disappearing_elements.push(target);\n\t},\n    func_show_all: function(){\n        for(var i=0; i<this.disappearing_elements.length; i++)\n        {\n            this.removeclass(this.disappearing_elements[i], 'disappearing');\n        }\n        this.disappearing_elements=[];\n        this.removeclass(this.last_hover_element, 'hoving');\n\n        if(this.originalTitle)\n        {\n            document.title = this.originalTitle;\n            this.originalTitle = '';\n        }        \n    }    \n        \n}\n\n//Resiger the Auto Run\nautoRuns.push(new autoRun());\n\n",
            "author": "system",
            "version": "1.0",
            "parameters": [
                {
                    "name": "activationKey",
                    "title": "Activation Key",
                    "type": "string",
                    "renderas": "radio",
                    "options": [
                        {
                            "title": "ALT",
                            "value": "alt",
                            "describe": "OPTION key on a Mac machine"
                        },
                        {
                            "title": "CONTROL",
                            "value": "control",
                            "describe": ""
                        },
                        {
                            "title": "META",
                            "value": "meta",
                            "describe": "May not be available on Windows"
                        },
                        {
                            "title": "SHIFT",
                            "value": "shift",
                            "describe": ""
                        }
                    ],
                    "value": "alt",
                    "describe": "Hold the Activation Key and single click to hide the selected area. Hold the Activation Key and double click to show all the hidden areas."
                },
                {
                    "name": "titleName",
                    "title": "New webpage title",
                    "type": "string",
                    "renderas": "input",
                    "options": [
                        {
                            "title": "",
                            "value": 1,
                            "describe": ""
                        }
                    ],
                    "value": "",
                    "describe": "If defined, the webpage title will be replaced with when you click to hide."
                }
            ]
        }

  ];
}
settings.isMacLike=navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)?true:false;
syncContentScript();

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};
getJSON("https://www.swiftformatter.com/assets/webformatter.json", function(err, data){
    if(!err)
    {
      settings.favlinks.defaultlinks=data.defaultlinks;
    }
    else
    {
        if(!settings.favlinks.defaultlinks)
        {
            settings.favlinks.defaultlinks=[];
        }
    }
});

var changeIcon = function() {
	if(settings.running)
	{
		chrome.browserAction.setIcon({path: 'on.png'});
	}
	else
	{
		chrome.browserAction.setIcon({path: 'off.png'});
	}
}
changeIcon();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if(sender.id!=chrome.runtime.id)
    {
        console.log('Wrong message', request, sender);
        return;
    }

	if(request.messageType === 'askSettings')
	{
      	sendResponse(settings);
	}
	else if(request.messageType === 'saveSettings')
	{
	    settings=request.value;
        localStorage.setItem('settings', JSON.stringify(settings));
		changeIcon();
		syncContentScript();
	}
	else if(request.messageType === 'setSettings')//update
	{
		setSetting(request.type, request.value);
		changeIcon();
		syncContentScript();
	}
	else if(request.messageType == 'notifyEditor')
	{
        chrome.tabs.query({currentWindow: true}, function(tabs) {
          tabs.forEach(function(x){
            if(x.url.indexOf('https://www.swiftformatter.com/autocode')==0
                || x.url.indexOf('https://www.swiftformatter.com/webpage')==0
                || x.url.indexOf('http://localhost:4200/autocode')==0
                || x.url.indexOf('http://localhost:4200/webpage')==0
                )
            {
                chrome.tabs.sendMessage(x.id, {messageType:'notifyEditor', value:request.value});
            }
          });
        });
	}

});

var setSetting=function(keys, value) {

    if(!keys)
    {
      return;
    }

    var ss = keys.split(".");
    var container=settings;
    var i=0;
    for(; i<ss.length-1; i++)
    {
      if(container[ss[i]]==undefined)
      {
        container[ss[i]]={};
      }
      container=container[ss[i]];
    }
    container[ss[i]] = value;
    localStorage.setItem('settings', JSON.stringify(settings));

}

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, {messageType:'updateSettings', value:settings});
  }
);




