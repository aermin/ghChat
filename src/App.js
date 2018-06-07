import React, {Component} from 'react';

import getRouter from './router/router';

export default class App extends Component {
    componentWillMount() {
       	//获取屏幕比例
		function sreenRatio() {
			const ua = navigator.userAgent;
			const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
			const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
			const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
			const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
			var dpr = window.devicePixelRatio || 1;
			if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
				// 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
				dpr = 1;
			}
			return dpr;
		}
		//初始化屏幕比例
		function screenRatio(baseFontSize, fontscale) {
			var ratio = sreenRatio();
			console.log(ratio)
			var scale = document.createElement('meta');
			var scaleRatio = 1 / ratio;
			scale.name = 'viewport';
			scale.content = 'width=device-width,' + 'initial-scale=' + scaleRatio + ', maximum-scale=' + scaleRatio + ', minimum-scale=' +
				scaleRatio + ', user-scalable=no';
			var s = document.getElementsByTagName('title')[0];
			s.parentNode.insertBefore(scale, s);
			var _baseFontSize = baseFontSize || 100;
			var _fontscale = fontscale || 1;
			document.documentElement.style.fontSize = _baseFontSize / 2 * ratio * _fontscale + 'px';

		}
		if (window.screen.width >= 768) {
			screenRatio(100, 1.3); //字体放大1.3倍
		} else {
			screenRatio();
        }
    }
    render() {
        return (
            <div>
                {getRouter()}
            </div>
        )
    }
}