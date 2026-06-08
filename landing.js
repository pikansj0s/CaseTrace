/* ──────────────────────────────────────────────────────────────
   CaseTrace · delt script til landingssider
   Download (henter .exe fra seneste GitHub-release) + scroll-reveal.
   ────────────────────────────────────────────────────────────── */
(function(){
  var DL_OWNER = 'pikansj0s', DL_REPO = 'CaseTrace';
  var DL_RELEASES_PAGE = 'https://github.com/' + DL_OWNER + '/' + DL_REPO + '/releases/latest';
  var busy = false;

  async function startDownload(){
    if(busy) return; busy = true;
    var status = document.getElementById('dl-status');
    if(status){ status.classList.remove('error'); status.textContent = 'Forbereder download …'; }
    try{
      var r = await fetch('https://api.github.com/repos/' + DL_OWNER + '/' + DL_REPO + '/releases/latest', {headers:{'Accept':'application/vnd.github+json'}});
      var data = await r.json();
      var asset = (data.assets || []).find(function(a){ return /\.exe$/i.test(a.name); });
      if(asset && asset.browser_download_url){
        var a = document.createElement('a');
        a.href = asset.browser_download_url; a.download = asset.name;
        document.body.appendChild(a); a.click(); a.remove();
        if(status) status.textContent = 'Download startet — tjek din browsers downloadmappe.';
        busy = false; return;
      }
    }catch(e){}
    if(status){
      status.innerHTML = 'Åbn release-siden for at downloade manuelt: <a href="' + DL_RELEASES_PAGE + '" target="_blank" rel="noopener noreferrer">github.com/' + DL_OWNER + '/' + DL_REPO + ' →</a>';
      status.classList.add('error');
    }
    window.open(DL_RELEASES_PAGE, '_blank', 'noopener');
    busy = false;
  }

  document.querySelectorAll('[data-dl]').forEach(function(el){
    el.addEventListener('click', function(e){ e.preventDefault(); startDownload(); });
  });

  // Scroll-reveal
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){
      if(e.isIntersecting){ setTimeout(function(){ e.target.classList.add('in'); }, i*60); obs.unobserve(e.target); }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
})();
