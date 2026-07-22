type Language = 'en' | 'es';

type Translation = {
  role: string;
  headline: string;
  support: string;
  location: string;
  workCta: string;
  emailCta: string;
  mapLabel: string;
  mapLabelStart: string;
  mapLabelEnd: string;
  resetMap: string;
};

const translations: Record<Language, Translation> = {
  en: {
    role: 'Product designer',
    headline: 'I design products, systems, and flows where clarity and trust matter.',
    support: '- I partner with teams to turn complexity into simple, confident experiences.',
    location: 'Santo Domingo, Dominican Republic',
    workCta: 'View selected work',
    emailCta: 'Email me',
    mapLabel: 'Drag the nodes to interact. Reset the map when it gets messy.',
    mapLabelStart: 'Drag the nodes to interact.',
    mapLabelEnd: 'Reset the map when it gets messy.',
    resetMap: 'Reset map',
  },
  es: {
    role: 'Diseñador de producto',
    headline: 'Diseño productos, sistemas y flujos donde la claridad y la confianza importan.',
    support: '- Colaboro con equipos para convertir la complejidad en experiencias simples y seguras.',
    location: 'Santo Domingo, República Dominicana',
    workCta: 'Ver trabajo seleccionado',
    emailCta: 'Escríbeme',
    mapLabel: 'Mueve los nodos para interactuar. Reinicia el mapa cuando se desordene.',
    mapLabelStart: 'Mueve los nodos para interactuar.',
    mapLabelEnd: 'Reinicia el mapa cuando se desordene.',
    resetMap: 'Reiniciar mapa',
  },
};

const navTranslations: Record<string, { en: string; es: string }> = {
  'nav.work': { en: 'Work', es: 'Trabajo' },
  'nav.about': { en: 'What I do', es: 'Qué hago' },
  'nav.writing': { en: 'Writing', es: 'Escritura' },
  'nav.contact': { en: 'Contact', es: 'Contacto' },
};

const getNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getPreferredLanguage = (): Language => {
  try {
    const stored = window.localStorage.getItem('portfolio-language');
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    return 'en';
  }

  return 'en';
};

const setText = (selector: string, text: string) => {
  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.textContent = text;
  });
};

const createHeadline = (language: Language) => {
  const fragment = document.createDocumentFragment();
  const prefix =
    language === 'es'
      ? 'Diseño productos, sistemas y flujos donde la claridad y la confianza '
      : 'I design products, systems, and flows where clarity and trust ';
  const markedWord = language === 'es' ? 'importan.' : 'matter.';
  const word = document.createElement('span');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNamespace, 'svg');
  const firstPath = document.createElementNS(svgNamespace, 'path');
  const secondPath = document.createElementNS(svgNamespace, 'path');

  word.className = 'headline-mark-word';
  word.textContent = markedWord;
  svg.classList.add('mark', 'mark--clarity');
  svg.setAttribute('viewBox', '0 0 160 22');
  svg.setAttribute('aria-hidden', 'true');
  firstPath.setAttribute('d', 'M4 15c28-8 57-10 86-9 22 1 43 4 66 1');
  secondPath.setAttribute('d', 'M26 20c36-8 69-11 107-9');
  [firstPath, secondPath].forEach((path) => {
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--color-blue)');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '4');
  });
  svg.append(firstPath, secondPath);
  word.append(svg);
  fragment.append(prefix, word);

  return fragment;
};

const applyLanguage = (language: Language) => {
  document.documentElement.lang = language;
  document.documentElement.dataset.lang = language;

  const dictionary = translations[language];
  Object.entries(dictionary).forEach(([key, value]) => setText(`[data-i18n="${key}"]`, value));

  document.querySelectorAll<HTMLElement>('[data-i18n="headline"]').forEach((element) => {
    element.replaceChildren(createHeadline(language));
  });

  Object.entries(navTranslations).forEach(([key, value]) => {
    setText(`[data-i18n="${key}"]`, value[language]);
  });

  document.querySelectorAll<HTMLElement>('[data-en][data-es]').forEach((element) => {
    const value = element.dataset[language];
    if (value) element.textContent = value;
  });

  document.querySelectorAll<HTMLElement>('[data-aria-en][data-aria-es]').forEach((element) => {
    const value = language === 'es' ? element.dataset.ariaEs : element.dataset.ariaEn;
    if (value) element.setAttribute('aria-label', value);
  });

  document.querySelectorAll<HTMLButtonElement>('[data-lang-option]').forEach((button) => {
    button.setAttribute('aria-pressed', `${button.dataset.langOption === language}`);
  });

  try {
    window.localStorage.setItem('portfolio-language', language);
  } catch {
    // Ignore storage failures. The visible UI still updates.
  }
};

const setupLanguageToggle = () => {
  applyLanguage(getPreferredLanguage());

  document.querySelectorAll<HTMLButtonElement>('[data-lang-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const language = button.dataset.langOption;
      if (language === 'en' || language === 'es') applyLanguage(language);
    });
  });
};

const setupMobileNavigation = () => {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const nav = toggle?.closest<HTMLElement>('.hero__nav');
  const mobileViewport = window.matchMedia('(max-width: 760px)');

  if (!toggle || !menu) return;

  const setOpen = (isOpen: boolean) => {
    toggle.setAttribute('aria-expanded', `${isOpen}`);
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('is-open', isOpen);
    nav?.classList.toggle('is-menu-open', isOpen);
    document.body.classList.toggle('is-mobile-menu-open', isOpen);
  };

  toggle.addEventListener('click', () => {
    if (!mobileViewport.matches) return;

    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (!mobileViewport.matches || toggle.getAttribute('aria-expanded') !== 'true') return;
    if (!(event.target instanceof Node)) return;
    if (toggle.contains(event.target) || menu.contains(event.target)) return;

    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;

    setOpen(false);
    toggle.focus();
  });

  mobileViewport.addEventListener('change', () => setOpen(false));
};

const setupFlowMap = () => {
  const map = document.querySelector<HTMLElement>('[data-flow-map]');
  if (!map) return;

  const nodes = Array.from(map.querySelectorAll<HTMLElement>('[data-node]'));
  const paths = Array.from(map.querySelectorAll<SVGPathElement>('[data-connection]'));
  const instruction = map.querySelector<HTMLElement>('[data-map-instruction]');
  const resetButton = document.querySelector<HTMLButtonElement>('[data-reset-map]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobilePointer = window.matchMedia('(max-width: 760px), (pointer: coarse)');

  const initialPositions = new Map<string, { x: number; y: number }>();
  let isDraggingNode = false;

  nodes.forEach((node) => {
    const id = node.dataset.node;
    if (!id) return;

    const x = getNumber(node.dataset.x, 0);
    const y = getNumber(node.dataset.y, 0);
    initialPositions.set(id, { x, y });
    node.style.setProperty('--x', `${x}`);
    node.style.setProperty('--y', `${y}`);
  });

  const pathConnectsToNode = (path: SVGPathElement, id: string) => path.dataset.from === id || path.dataset.to === id;

  const setHighlightedConnections = (id?: string) => {
    paths.forEach((path) => {
      const isConnected = id ? pathConnectsToNode(path, id) : false;
      path.classList.toggle('is-connected', isConnected);
      path.classList.toggle('is-dimmed', Boolean(id) && !isConnected);
    });
  };

  const setActiveConnections = () => {
    const activeNode = nodes.find((node) => node.classList.contains('flow-node--active'));
    const activeId = activeNode?.dataset.node;

    paths.forEach((path) => {
      path.classList.toggle('is-active-connection', activeId ? pathConnectsToNode(path, activeId) : false);
    });
  };

  const showInstructionAtPointer = (event: PointerEvent) => {
    if (!instruction || isDraggingNode) return;

    const mapRect = map.getBoundingClientRect();
    const instructionRect = instruction.getBoundingClientRect();
    const gap = 10;
    const offset = 16;
    let left = event.clientX - mapRect.left + offset;
    const top = event.clientY - mapRect.top + offset;

    if (left + instructionRect.width > mapRect.width - gap) {
      left = event.clientX - mapRect.left - instructionRect.width - offset;
    }

    const maxLeft = Math.max(gap, mapRect.width - instructionRect.width - gap);
    const maxTop = Math.max(gap, mapRect.height - instructionRect.height - gap);

    instruction.style.setProperty('--tooltip-x', `${clamp(left, gap, maxLeft)}px`);
    instruction.style.setProperty('--tooltip-y', `${clamp(top, gap, maxTop)}px`);
    instruction.classList.add('is-visible');
  };

  const showInstructionNearNode = (node: HTMLElement) => {
    if (!instruction || isDraggingNode) return;

    const mapRect = map.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const instructionRect = instruction.getBoundingClientRect();
    const gap = 10;
    let left = nodeRect.right - mapRect.left + gap;
    const top = nodeRect.top - mapRect.top + nodeRect.height / 2;

    if (left + instructionRect.width > mapRect.width - gap) {
      left = nodeRect.left - mapRect.left - instructionRect.width - gap;
    }

    const maxLeft = Math.max(gap, mapRect.width - instructionRect.width - gap);
    const maxTop = Math.max(gap, mapRect.height - instructionRect.height - gap);

    instruction.style.setProperty('--tooltip-x', `${clamp(left, gap, maxLeft)}px`);
    instruction.style.setProperty('--tooltip-y', `${clamp(top, gap, maxTop)}px`);
    instruction.classList.add('is-visible');
  };

  const hideInstruction = () => {
    instruction?.classList.remove('is-visible');
  };

  const getNodeBox = (id: string) => {
    const node = nodes.find((item) => item.dataset.node === id);
    if (!node) return null;

    const mapRect = map.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    return {
      left: nodeRect.left - mapRect.left,
      top: nodeRect.top - mapRect.top,
      width: nodeRect.width,
      height: nodeRect.height,
      centerX: nodeRect.left - mapRect.left + nodeRect.width / 2,
      centerY: nodeRect.top - mapRect.top + nodeRect.height / 2,
    };
  };

  const getEdgePoint = (
    source: NonNullable<ReturnType<typeof getNodeBox>>,
    target: NonNullable<ReturnType<typeof getNodeBox>>,
  ) => {
    const deltaX = target.centerX - source.centerX;
    const deltaY = target.centerY - source.centerY;

    if (deltaX === 0 && deltaY === 0) {
      return { x: source.centerX, y: source.centerY };
    }

    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      return {
        x: source.centerX + (deltaX > 0 ? source.width / 2 : -source.width / 2),
        y: source.centerY,
      };
    }

    return {
      x: source.centerX,
      y: source.centerY + (deltaY > 0 ? source.height / 2 : -source.height / 2),
    };
  };

  const getElbowPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    if (Math.abs(deltaY) < 8 || Math.abs(deltaX) < 8) {
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }

    const radius = Math.min(18, Math.abs(deltaX) / 2, Math.abs(deltaY) / 2);
    const horizontalFirst = Math.abs(deltaX) >= Math.abs(deltaY);
    const xDirection = deltaX > 0 ? 1 : -1;
    const yDirection = deltaY > 0 ? 1 : -1;

    if (horizontalFirst) {
      const middleX = from.x + deltaX / 2;
      return [
        `M ${from.x} ${from.y}`,
        `H ${middleX - radius * xDirection}`,
        `Q ${middleX} ${from.y} ${middleX} ${from.y + radius * yDirection}`,
        `V ${to.y - radius * yDirection}`,
        `Q ${middleX} ${to.y} ${middleX + radius * xDirection} ${to.y}`,
        `H ${to.x}`,
      ].join(' ');
    }

    const middleY = from.y + deltaY / 2;
    return [
      `M ${from.x} ${from.y}`,
      `V ${middleY - radius * yDirection}`,
      `Q ${from.x} ${middleY} ${from.x + radius * xDirection} ${middleY}`,
      `H ${to.x - radius * xDirection}`,
      `Q ${to.x} ${middleY} ${to.x} ${middleY + radius * yDirection}`,
      `V ${to.y}`,
    ].join(' ');
  };

  const updateConnections = () => {
    paths.forEach((path) => {
      const fromBox = path.dataset.from ? getNodeBox(path.dataset.from) : null;
      const toBox = path.dataset.to ? getNodeBox(path.dataset.to) : null;

      if (!fromBox || !toBox) {
        path.setAttribute('d', '');
        return;
      }

      const from = getEdgePoint(fromBox, toBox);
      const to = getEdgePoint(toBox, fromBox);
      path.setAttribute('d', getElbowPath(from, to));
    });
  };

  const setPositionFromPixels = (node: HTMLElement, left: number, top: number) => {
    const mapRect = map.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const maxLeft = mapRect.width - nodeRect.width;
    const maxTop = mapRect.height - nodeRect.height;
    const clampedLeft = clamp(left, 0, maxLeft);
    const clampedTop = clamp(top, 0, maxTop);
    const x = (clampedLeft / mapRect.width) * 100;
    const y = (clampedTop / mapRect.height) * 100;

    node.style.left = `${clampedLeft}px`;
    node.style.top = `${clampedTop}px`;
    node.style.removeProperty('--x');
    node.style.removeProperty('--y');
    node.dataset.currentX = `${x}`;
    node.dataset.currentY = `${y}`;
  };

  const resetPositions = () => {
    nodes.forEach((node) => {
      const id = node.dataset.node;
      if (!id) return;

      const position = initialPositions.get(id);
      if (!position) return;

      node.style.removeProperty('left');
      node.style.removeProperty('top');
      node.style.setProperty('--x', `${position.x}`);
      node.style.setProperty('--y', `${position.y}`);
      delete node.dataset.currentX;
      delete node.dataset.currentY;
    });

    updateConnections();
  };

  const enableDragging = () => {
    nodes.forEach((node) => {
      const id = node.dataset.node;

      node.addEventListener('pointerenter', (event) => {
        setHighlightedConnections(id);
        showInstructionAtPointer(event);
      });
      node.addEventListener('pointermove', (event) => {
        showInstructionAtPointer(event);
      });
      node.addEventListener('pointerleave', () => {
        if (!node.classList.contains('is-dragging')) {
          setHighlightedConnections();
          hideInstruction();
        }
      });
      node.addEventListener('focus', () => {
        setHighlightedConnections(id);
        showInstructionNearNode(node);
      });
      node.addEventListener('blur', () => {
        setHighlightedConnections();
        hideInstruction();
      });

      node.addEventListener('pointerdown', (event) => {
        if (mobilePointer.matches) return;

        const target = event.target;
        if (target instanceof HTMLButtonElement) return;

        const mapRect = map.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const offsetX = event.clientX - nodeRect.left;
        const offsetY = event.clientY - nodeRect.top;

        node.classList.add('is-dragging');
        isDraggingNode = true;
        setHighlightedConnections(id);
        hideInstruction();
        node.setPointerCapture(event.pointerId);

        const moveNode = (moveEvent: PointerEvent) => {
          const left = moveEvent.clientX - mapRect.left - offsetX;
          const top = moveEvent.clientY - mapRect.top - offsetY;
          setPositionFromPixels(node, left, top);
          updateConnections();
        };

        const stopDrag = () => {
          node.classList.remove('is-dragging');
          isDraggingNode = false;
          setHighlightedConnections();
          hideInstruction();
          node.removeEventListener('pointermove', moveNode);
          node.removeEventListener('pointerup', stopDrag);
          node.removeEventListener('pointercancel', stopDrag);
        };

        node.addEventListener('pointermove', moveNode);
        node.addEventListener('pointerup', stopDrag);
        node.addEventListener('pointercancel', stopDrag);
      });
    });
  };

  resetButton?.addEventListener('click', resetPositions);
  window.addEventListener('resize', updateConnections);
  reducedMotion.addEventListener('change', updateConnections);
  enableDragging();
  setActiveConnections();
  updateConnections();
};

setupLanguageToggle();
setupMobileNavigation();
setupFlowMap();
