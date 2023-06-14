import '../wdyr';

declare global {
  interface Window {
    ILT_MAP: any;
  }
}

document.addEventListener('DOMSubtreeModified', OnSubtreeModified, false);
function OnSubtreeModified() {
  // synchronously download the finerprint resource and inject a second <meta> tag once BPR is ready.
  var url = document.querySelector('meta[name="iltSupportUrl"]').getAttribute('content');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send();
  if (xhr.status === 200) {
    var data = xhr.responseText;
    const truncatedResponse = data.substring(0, 100);
    const appendedResponse = truncatedResponse + '... <n> bytes';
    console.log(appendedResponse);
  }
  var meta = document.createElement('meta');
  meta.name = 'support-ilt-content';
  meta.content = data;

  document.removeEventListener('DOMSubtreeModified', OnSubtreeModified, false);
  (document.head || document.documentElement).appendChild(meta);
}
