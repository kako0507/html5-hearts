define(() => {
  let names = ['Chakravartin', 'Octavian', 'Antony', 'Lepidus'];


  let levels = [-1, 1, 2, 3];

  try {
    const loadedNames = JSON.parse(localStorage.getItem('names'));
    if (loadedNames) names = loadedNames;
  } catch (e) {}

  try {
    const loadedLevels = JSON.parse(localStorage.getItem('levels'));
    if (loadedLevels) levels = loadedLevels;
  } catch (e) {}

  return {
    names,
    levels,
    sync() {
      localStorage.setItem('names', JSON.stringify(names));
      localStorage.setItem('levels', JSON.stringify(levels));
    },
  };
});
