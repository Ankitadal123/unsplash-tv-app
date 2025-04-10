module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      config: './tailwind.config.js'
    },
    'autoprefixer': {},
    'postcss-reporter': {
      clearReportedMessages: true,
      throwError: true
    }
  }
};
