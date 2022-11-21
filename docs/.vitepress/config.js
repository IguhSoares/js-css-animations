import anchor from 'markdown-it-anchor';

export default {
  title: 'Js-Css Animations',
  description: 'Animate your web apps or site using Javascript',
  appearance: 'dark',
  markdown: {
    anchor: {
      getTokensText: tokens => {
        const tokensText = tokens
          .filter(t => t.type === 'text' && t.info !== 'entity' && t.content)
          .map(t => t.content)
          .join('')
          .replace(/(?!\s.+\))\s.*$/, '')
          .replace('(', '-');
        return tokensText;
      },
      permalink: anchor.permalink.ariaHidden({
        symbol: '§',
      }),
    },
  },
};
