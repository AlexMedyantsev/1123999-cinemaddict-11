export const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

export const replace = (oldElement, newElement) => {
  const parentNode = oldElement.getElement().parentElement;
  parentNode.replaceChild(newElement.getElement(), oldElement.getElement());
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

