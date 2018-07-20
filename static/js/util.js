define(() => {
  const $ = function (query) {
    return document.querySelectorAll(query);
  };

  const vendorPrefix = (function () {
    if (window.isDebug) return '';
    const prefixes = ['Moz', 'Webkit', 'O', 'ms'];


    const tran = 'Transform';

    const el = document.createElement('div');

    for (let i = 0; i < prefixes.length; ++i) {
      const vendorTran = prefixes[i] + tran;
      if (vendorTran in el.style) {
        return prefixes[i];
      }
    }
  }());

  return {
    $,
    vendorPrefix,
  };
});
