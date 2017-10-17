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
  settings = {running: true};
}
if(!settings.imagehoving)
{
  settings.imagehoving={running: true};
  settings.imagehoving.activationKey='alt';
}
if(!settings.clicktohide)
{
  settings.clicktohide={running: true};
  settings.clicktohide.activationKey='alt';
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
            if(x.url.indexOf('https://www.swiftformatter.com/autocode')==0 || x.url.indexOf('http://localhost:4200/autocode')==0)
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




