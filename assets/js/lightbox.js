(function () {
  // 创建全屏遮罩层
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<img alt="放大图">';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  var overlayImg = overlay.querySelector('img');

  function open(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 给文章/页面里的图片绑定点击放大
  function bind() {
    var imgs = document.querySelectorAll('.post-content img, .page img');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.dataset.lightboxBound) continue;
      img.dataset.lightboxBound = '1';
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        open(this.currentSrc || this.src, this.alt);
      });
    }
  }

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
