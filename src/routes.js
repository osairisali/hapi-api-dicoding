const { postBookHandler, getAllBooksHandler } = require('./handler');

const routes = [{
  method: 'POST',
  path: '/books',
  handler: postBookHandler,
}, {
  method: 'GET',
  path: '/books',
  handler: getAllBooksHandler,
}];

module.exports = routes;
