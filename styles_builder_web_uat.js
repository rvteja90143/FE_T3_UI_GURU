var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.id = 'inWidgetCSS';
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://stage-dealeradmin.eshopdemo.net/css/app-element-redesign-stage.css';
link.media = 'all';
head.appendChild(link);

const inputs = document.querySelectorAll('input[type="search"]');
if (inputs) {
    inputs.forEach(input => input.setAttribute('type', 'text'));
}