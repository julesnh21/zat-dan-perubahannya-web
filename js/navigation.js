(function(){
  const current=(location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('[data-nav]').forEach(a=>{if(a.getAttribute('href').endsWith(current))a.classList.add('active')});
})();
