function mTouch(objName)
{
	var _this=this;
	if(typeof objName =="object")
	{
		this._oBj=objName;
	}
	else
	{
		this._oBj=document.getElementById(objName);
	}
	this._iStartX=this._iStartY=0;
	this.iScroll=0;
	this.timer=0;
	this._oBj.addEventListener("touchstart",function(e){
		_this.start(e);	
		e.preventDefault();
	},false);
	this._oBj.addEventListener("touchmove",doMove,false);
	function doMove(e)
	{
		_this.move(e);
		e.preventDefault();
	}
	this._oBj.addEventListener("touchend",stopMove,false);
	function stopMove(e)
	{
		_this.end(e);
		e.preventDefault();
	}
	document.ontouchmove = function(e)
	{
		e.preventDefault();
	};
	document.ontouchend = function(e)
	{
		e.preventDefault();
	};
	document.ontouchstart = function(e)
	{
		e.preventDefault();
	};
}
mTouch.prototype=
{
	start:function(e)
	{
		var _this=this;
		var pos=e.touches ? e.touches[0] : e;
		var iStarTimer=new Date().getTime();
		this.timer=setInterval(function(){
			var iTimer=new Date().getTime() - iStarTimer;
			if(iTimer>=300 && _this._fnTap )
			{
				_this._fnTap.call(_this._oBj,e);
				clearInterval(_this.timer);
			} 
		},20);
		this.startScroll=this.iScroll;
		this._iStartX=pos.pageX;
		this._iStartY=pos.pageY;
		if(this.onScrollStart)
        {
                this.onScrollStart.call(this._oBj,e);
        }
	},
	move:function(e)
	{
		clearInterval(this.timer);
		if(this.onScrollMove)
        {
             this.onScrollMove.call(this._oBj,e);
        }
	},
	end:function(e)
	{
		e= e.touches ? e.changedTouches[0] : e;
		var iNowX=e.pageX;
		var iNowY=e.pageY;
		var iDisX=iNowX-this._iStartX;
		var iDisY=iNowY-this._iStartY;
		if(iDisX<=-80 && Math.abs(iDisY)<30  && this._fnSlideLeft)
		{
			this._fnSlideLeft.call(this._oBj);
		}
		if(iDisX>=80 && Math.abs(iDisY)<30 && this._fnSlideRight)
		{
			this._fnSlideRight.call(this._oBj);
		}
		if(iDisY<=-80 && Math.abs(iDisX)<30 && this._fnSlideUp)
		{
			this._fnSlideUp.call(this._oBj);
		}
		if(iDisY>=80 && Math.abs(iDisX)<30 && this._fnSlideDown)
		{
			this._fnSlideDown.call(this._oBj);
		}
	},
	tap:function(fn)
	{
		this._fnTap=fn;
	},
	slideLeft:function(fn)
	{
		this._fnSlideLeft=fn;
	},
	slideRight:function(fn)
	{
		this._fnSlideRight=fn;
	},
	slideUp:function(fn)
	{
		this._fnSlideUp=fn;
	},
	slideDown:function(fn)
	{
		this._fnSlideDown=fn;
	}	
};
function m$(objName)
{
	return new mTouch(objName);
};
function mScroll(idName,sD,bBack)
{
	var _this=this;
	if(typeof idName == "object")
	{
		this._wrap=idName;
	}
	else
	{
		this._wrap=document.getElementById(idName);
	}
	this._scroll=this._wrap.children[0];
	this._sD=sD;
	this._iStart=0;
	this.iScroll=0;
	this.timer=0;
	this._bOver=false;
	this._bBack=(typeof bBack!='undefined')?bBack:true;
	this._bMove=false;
	this.over=this._bBack?50:0;
	this._WrapHeight=this._wrap.clientHeight;
	this._Bar=document.createElement("div");
	this._Bar.style.cssText="width:4px;background:rgba(0,0,0,0.5);border-radius:5px;position:fixed;right:0;z-index:100;opacity:0;";
	document.body.appendChild(this._Bar);
	this._wrap.addEventListener("touchstart",function(e){
		_this.start(e);	
	},false);
	this._wrap.addEventListener("touchmove",doMove,false);
	function doMove(e)
	{
		_this.move(e);
	}
	this._wrap.addEventListener("touchend",stopMove,false);
	function stopMove(e)
	{
		_this.end(e);
	}
	document.ontouchmove = function(e)
	{
		e.preventDefault();
	};
	this._tween = {
		easeOut: function(t, b, c, d){
			return -c *(t/=d)*(t-2) + b;
		},    
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 3.70158;  //回缩的距离
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}
	};
}
mScroll.prototype=
{
	start:function(e)
	{
		var _this=this;
		e=e.touches ? e.touches[0] : e;
		if(this._scroll.offsetHeight<=this._wrap.clientHeight)
		{
			this._bMove=true;
			return;
		}
		else
		{
			this._bMove=false;
		}
		this.timer=new Date().getTime();
		this.startScroll=this.iScroll;
		this._iStart= this._sD=="x"?e.pageX:e.pageY;
		this._max=this._scroll.offsetHeight-this._wrap.clientHeight;
		this._iScale=this._WrapHeight/this._scroll.offsetHeight
		this._Bar.style.height=Math.floor(this._WrapHeight*this._iScale)+"px";
		this._Bar.style.opacity=1;
		this.barMove();
		if(this.onScrollStart)
        {
                this.onScrollStart.call(this._wrap);
        }
	},
	move:function(e)
	{
		clearInterval(this._scroll.timer);
		e=e.touches ? e.touches[0] : e;
		var iNow= this._sD=="x"?e.pageX:e.pageY;
		var iDis=iNow-this._iStart;
		if(this._bMove)
		{
			return;
		}
		this.iScroll=Math.round(this.startScroll+iDis);	
		if(this.iScroll>this.over)
		{
			this.iScroll=this.over;
			if(this._bBack)
			{	
				this.over++;
			}
		}
		if(this.iScroll<-this._max-this.over)
		{
			this.iScroll=-this._max-this.over;
			if(this._bBack)
			{	
				this.over++;
			}
		}
		this.barMove();
		var sT= this._sD=="x"?"translateX("+this.iScroll+"px)":"translateY("+this.iScroll+"px)";
		this._scroll.style.WebkitTransform=this._scroll.style.MozTransform=this._scroll.style.transform=sT;
		if(this.onScrollMove)
        {
             this.onScrollMove.call(this._wrap);
        }
	},
	end:function(e)
	{
		e= e.touches ? e.changedTouches[0] : e;
		if(this._bMove)
		{
			return;
		}
		var iNow= this._sD=="x"?e.pageX:e.pageY;
		var iDis=iNow-this._iStart;
		var sType="easeOut";
		var iTarget=0;
		this.timer=new Date().getTime()-this.timer;
		var iEndL=iDis/this.timer*10;
		iEndL=Math.abs(iEndL)<5?0:iEndL*30;
		iTarget=Math.round(this.startScroll+iDis+iEndL);
		if((iTarget>0||iTarget<-this._max) && this.startScroll>-this._max && this.startScroll<0 && this._bBack)
		{
			sType="backOut";
		}	
		if(iTarget>0)
		{
			iTarget=0;	
		}
		if(iTarget<-this._max)
		{
			iTarget=-this._max;
			this._bOver=true;
		}
		this.tweenMove(this._scroll,iTarget,sType);		
		this.over=this._bBack?50:0;
	},
	barMove:function()
	{
		this._Bar.style.top=-this.iScroll*this._iScale+"px";
	}
	,
	tweenMove:function(obj,iTarget,iType)
	{
		var fn=this._tween[iType];
		var t=0;
		var b=this.iScroll;
		var c=iTarget-b;
		var d=25;
		var _this=this;
		var sT="";
		clearInterval(obj.timer);
		obj.timer=setInterval(
		function()
		{
			if(t<d)
			{
				t++;
				_this.iScroll=fn(t,b,c,d);
				_this.barMove();
			}
			else
			{
				_this.iScroll=iTarget;			
				clearInterval(_this._scroll.timer);
				_this._Bar.style.opacity=0;
				if(_this.onScrollEnd)
				{
					_this.onScrollEnd.call(obj);
				}
				if(_this._bOver && _this.onScrollOver)
				{
					_this.onScrollOver.call(obj);
				}
			}
			sT=_this._sD=="x"?"translateX("+_this.iScroll+"px)":"translateY("+_this.iScroll+"px)";
			obj.style.WebkitTransform=obj.style.transform=sT;
			if(_this.onScrollMove)
			{
				 _this.onScrollMove.call(obj);
			}
		},20);
	}	
};
