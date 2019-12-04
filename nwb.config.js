module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactSortableTable',
      externals: {
        react: 'React'
      }
    }
  }
}
