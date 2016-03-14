//封装获取style样式
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj)[attr];
	};
};
window.onload=function(){
	//设备尺寸宽高
	var oHtml=document.getElementsByTagName("html")[0];
	var iWidth=document.documentElement.clientWidth;
	iWidth=iWidth>540?540:iWidth;
	oHtml.style.fontSize=iWidth/16+"px";
	document.body.style.height=document.documentElement.clientHeight+"px";
	//图片切换效果
	//图片
	var aImg=document.getElementById("aImg");//图片父级，用来运动
	var aA=aImg.getElementsByTagName("a");//所有的图片
	//底部圆点
	var oUl=document.getElementById("div_ul");//圆点父级
	var aLi=oUl.getElementsByTagName("a");//圆点
	//获取当前一张大图的宽度
	var current=parseInt(getStyle(aA[0],"width"));
	var timer;//定时器
	var n=1;//下标
	init();
	//自定义函数，让图片自动轮播
	function init(){
		//开启定时器
		timer=setInterval(function(){
			n++;
			if(n>aA.length-1){//到最后一张让他回到第一张
				n=1;
			};
			aImg.style.left=-(n*current)+"px";
			aImg.style.transition=".5s";							
			for(var i=0;i<aLi.length;i++){//暴力清除所有的className
				aLi[i].className="";
			}
			if(n>aLi.length){
				aLi[0].className="active";
			}else{
				aLi[n-1].className="active";
			}
			
		},2000)
	};				
	var onOff=false;
	aImg.addEventListener("webkitTransitionEnd",function(){
		if(n>=aA.length-1&&n>aLi.length){//判断下标如果大于最后一张，那么去掉transition,把图片拉回到第二张图
			aImg.style.transition = "none";
			aImg.style.left=-current+"px";
			n=1;
		}else if(n<=0){//判断下标如果小于第一张，那么把它拉回到倒数第二张
			aImg.style.transition = "none";
			aImg.style.left=-((aA.length-2)*current)+"px";
			n=aA.length-2;
		}
		onOff=false;
	});
	//给底部li添加事件
	for(var i=0;i<aLi.length;i++){
		aLi[i].index=i;
		aLi[i].onmouseover=function(){
			clearInterval(timer);
			for(var i=0;i<aLi.length;i++){//暴力清除所有的className
				aLi[i].className="";
			}
			this.className="active";
			aImg.style.left=-(this.index+1)*current+"px";
			aImg.style.transition=".5s";	
			onOff=true;
		};
		aLi[i].onmouseout=function(){	
			n=this.index+1;
			init();
		};
	};
	
}

