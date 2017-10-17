

//click to Hide code
function ClickToHide() {
	this.isActivated= isActivated;
	this.last_hover_element=null;
	this.disappearing_elements=[];
	this.last_click=0;
	this.originalTitle='';
	this.styleClasses = {
    	hoving:' zhl_hovering',
    	disappearing:' zhl_disappearing'
    };
}

ClickToHide.prototype = {
    removeclass: function(element, name){
		if(element && element.className && element.className.indexOf && element.className.indexOf(this.styleClasses[name])!=-1)
		{
			element.className = element.className.replace(this.styleClasses[name], '');
			for(var i=0; i<element.childNodes.length; i++)
			{
				this.removeclass(element.childNodes[i], name);
			}
		}
	},
	addclass: function(element, name){
		if(element && element.className && element.className.indexOf && element.className.indexOf(this.styleClasses[name])!=-1)
		{
			return;
		}
		if(!element.className)
		{
			element.className='';
		}
		element.className += this.styleClasses[name];

		for(var i=0; i<element.childNodes.length; i++)
		{
			this.addclass(element.childNodes[i], name);
		}
	},
	func_mousemove: function(e){
		if(!this.isActivated(e))
		{
			this.removeclass(this.last_hover_element, 'hoving');
			this.last_hover_element = null;
			return;
		}

		var target = e.target;
		if(this.last_hover_element != target)
		{
			this.removeclass(this.last_hover_element, 'hoving');
			this.addclass(target, 'hoving');
			this.last_hover_element = target;
		}
	},
	func_document_click: function(e){
		if(!this.isActivated(e))
		{
			return;
		}
		e.preventDefault();
		e.stopImmediatePropagation();

		var now=new Date().getTime();
		if(now - this.last_click <= 500)
		{
			for(var i=0; i<this.disappearing_elements.length; i++)
			{
				this.removeclass(this.disappearing_elements[i], 'disappearing');
			}
			this.disappearing_elements=[];
			this.removeclass(this.last_hover_element, 'hoving');

			if(this.originalTitle)
			{
				document.title = this.originalTitle;
				this.originalTitle = '';
			}

			return;
		}
		this.last_click=now;

		if(this.setting.titleName)
		{
			if(!this.originalTitle)
			{
				this.originalTitle = document.title;
			}
			document.title = this.setting.titleName;
		}

		var target = e.target;
		this.addclass(target, 'disappearing');
		this.disappearing_elements.push(target);
	},
    init: function(settings) {
		this.setting=settings.clicktohide;

        if(settings.running && this.setting.running)
        {
			if(!this.eventHandles)
			{
				this.eventHandles={mousemove:this.func_mousemove.bind(this), click:this.func_document_click.bind(this)};
				document.addEventListener('mousemove', this.eventHandles.mousemove);
				document.addEventListener('click', this.eventHandles.click);
			}
        }
        else
        {
        	if(this.eventHandles)
        	{
				document.removeEventListener('mousemove', this.eventHandles.mousemove);
				document.removeEventListener('click', this.eventHandles.click);
				this.eventHandles=null;
        	}
        }
    }
}

addons.push(new ClickToHide());
