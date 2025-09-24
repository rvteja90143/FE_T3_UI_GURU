var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.id = 'inWidgetCSS';
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://dealeradmin.drivefca.com/css/app-element-redesign-prod.css';
link.media = 'all';
head.appendChild(link);

const inputs = document.querySelectorAll('input[type="search"]');
if (inputs) {
    inputs.forEach(input => input.setAttribute('type', 'text'));
}