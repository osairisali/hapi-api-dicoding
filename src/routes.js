const {
  postBookHandler, getAllBooksHandler, getBookHandler, updateBookHandler, deleteBookHandler,
} = require('./handler');

const routes = [{
  method: 'POST',
  path: '/books',
  handler: postBookHandler,
}, {
  method: 'GET',
  path: '/books',
  handler: getAllBooksHandler,
}, {
  method: 'GET',
  path: '/books/{bookId}',
  handler: getBookHandler,
}, {
  method: 'PUT',
  path: '/books/{bookId}',
  handler: updateBookHandler,
}, {
  method: 'DELETE',
  path: '/books/{bookId}',
  handler: deleteBookHandler,
}];

module.exports = routes;
