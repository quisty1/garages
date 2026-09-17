/** @type {import('stylelint').Config} */
const config = {
  extends: ['stylelint-config-standard'],
  rules: {
    // The site consistently uses BEM names such as .calculator__field--wide.
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$',
      { resolveNestedSelectors: true },
    ],
    // Theme, responsive, and progressive-enhancement layers intentionally
    // override earlier selectors without reordering the source cascade.
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'declaration-block-no-shorthand-property-overrides': null,
  },
};

export default config;
