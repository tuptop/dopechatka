(() => {
  const desktopWidth = 1050;
  const desktopMaxWidth = 1200;
  const mobileWidth = 375;
  const mobile = matchMedia('(max-width: 759px)');
  const root = document.documentElement;
  const page = document.getElementById('page');
  let frame;
  let observer;
  let scale = 1;

  const fitHeight = () => {
    if (frame) frame.style.height = page.getBoundingClientRect().height + 'px';
  };

  const fit = () => {
    const width = root.clientWidth;
    if (mobile.matches) {
      scale = width / mobileWidth;
      root.style.setProperty('--page-w', mobileWidth + 'px');
      if (!frame) {
        root.style.setProperty('--zoom', scale);
        if (scale === 1 || Math.abs(page.getBoundingClientRect().width - width) < 0.5) return;

        // Запасной вариант для браузеров без рабочего CSS zoom.
        frame = document.createElement('div');
        frame.style.overflow = 'hidden';
        if (CSS.supports('overflow', 'clip')) frame.style.overflow = 'clip';
        page.before(frame);
        frame.append(page);
        if ('ResizeObserver' in window) {
          observer = new ResizeObserver(fitHeight);
          observer.observe(page);
        }
      }

      root.style.setProperty('--zoom', '1');
      page.style.margin = '0';
      page.style.transformOrigin = 'top left';
      page.style.transform = 'scale(' + scale + ')';
      fitHeight();
      return;
    }

    if (frame) {
      if (observer) observer.disconnect();
      frame.before(page);
      frame.remove();
      frame = null;
      page.style.removeProperty('margin');
      page.style.removeProperty('transform-origin');
      page.style.removeProperty('transform');
    }
    root.style.removeProperty('--page-w');
    root.style.setProperty('--zoom', Math.min(desktopMaxWidth, width) / desktopWidth);
  };

  fit();
  window.addEventListener('resize', fit, { passive: true });
  window.addEventListener('load', fitHeight);
})();
