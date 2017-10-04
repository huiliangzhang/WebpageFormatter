var settings;
var isActivated = function(e) {
	if(!settings.running)
	{
		return false;
	}
	
	if((settings.activationKey == 'shift' && e.shiftKey) || 
	   (settings.activationKey == 'alt' && e.altKey) ||
	   (settings.activationKey == 'meta' && e.metaKey) ||
	   (settings.activationKey == 'control' && e.ctrlKey))
	{
		return true;
	}
	return false;
}

var last_hover_element;
var disappearing_elements=[];
var last_click=0;
var func_mousemove = function(e){
	if(!isActivated(e))
	{
		styleClasses.remove(last_hover_element, 'hoving');
		last_hover_element = null;
		return;
	}
	
	var target = e.target;	
	if(last_hover_element != target)
	{
		styleClasses.remove(last_hover_element, 'hoving');
		styleClasses.add(target, 'hoving');		
		last_hover_element = target;
	}	
}

var originalTitle;


var func_document_click = function(e){
	if(!isActivated(e))
	{
		return;
	}
	e.preventDefault();
	e.stopPropagation();
	
	var now=new Date().getTime();
	if(now - last_click <= 500)
	{
		disappearing_elements.forEach(function(x){ styleClasses.remove(x, 'disappearing'); });
		disappearing_elements=[];
		styleClasses.remove(last_hover_element, 'hoving');
		
		if(originalTitle)
		{
			document.title = originalTitle;
		}
		
		return;
	}
	last_click=now;
	
	if(settings.titleName)
	{
		if(!originalTitle)
		{
			originalTitle = document.title;
		}
		document.title = settings.titleName;
	}
	
	var target = e.target;
	styleClasses.add(target, 'disappearing');	
	disappearing_elements.push(target);	
}

var syncSettings = function() {

	if(settings.running)
	{
		document.addEventListener('mousemove', func_mousemove);
		document.addEventListener('click', func_document_click);	
	}
	else
	{
		document.removeEventListener('mousemove', func_mousemove);
		document.removeEventListener('click', func_document_click);			
	}
	
	//this will disappear all images
	//eval ("Array.prototype.slice.call(document.getElementsByTagName('img')).forEach(function(x){ x.style.display='none' });");
    
}

chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
	settings = response;
	syncSettings();
});

var styleClasses={
	hoving:' zhl_hovering',
	disappearing:' zhl_disappearing'
};
styleClasses.remove = function(element, name){
	if(element && element.className && element.className.indexOf(styleClasses[name])!=-1)
	{
		element.className = element.className.replace(styleClasses[name], '');
		element.childNodes.forEach(function(x){styleClasses.remove(x, name)});
	}	
}
styleClasses.add = function(element, name){
	if(element && element.className && element.className.indexOf(styleClasses[name])!=-1)
	{
		return;
	}
	if(!element.className)
	{
		element.className='';
	}
	element.className += styleClasses[name];
	
	element.childNodes.forEach(function(x){styleClasses.add(x, name)});
	
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.type != 'askSettings')
	{
		settings = request;
		syncSettings();
	}
  }
);


