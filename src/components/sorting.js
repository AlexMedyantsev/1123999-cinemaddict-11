const createSortingMarkup = (name) => {
  return (
    `<li><a href="#" class="sort__button">${name}</a></li>`
  );
};

export const createSortingTemplate = (sortElements) => {
  const sortingMarkup = sortElements.map((item) => createSortingMarkup(item.name)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortingMarkup}
    </ul>`
  );
};
