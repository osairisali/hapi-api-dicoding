/* eslint-disable new-cap */
const { nanoid } = require('nanoid');

let books = [];

exports.postBookHandler = (request, h) => {
  let failResponse = {
    status: 'error',
    message: 'Buku gagal ditambahkan',
  };

  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    if (!name) {
      failResponse = {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      };
      return h.response(failResponse).code(400);
    }

    if (readPage > pageCount) {
      failResponse = {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      };
      return h.response(failResponse).code(400);
    }

    const finished = readPage === pageCount;
    const id = nanoid(16);

    // check if book already in book array
    const bookIndex = books.findIndex((book) => book.name === name);
    if (bookIndex !== -1) {
      // update book array
      const updatedAt = new Date().toISOString();
      const { insertedAt } = books[bookIndex];

      const updatedBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
        insertedAt,
      };

      books[bookIndex] = updatedBook;

      console.log('books is updated: ', books);
      console.log('updated book: ', updatedBook);
      console.log('book index: ', bookIndex);

      // return update book response
      return h.response({
        status: 'success',
        message: 'Buku berhasil diupdate',
      }).code(200);
    }

    const updatedAt = new Date().toISOString();
    const insertedAt = updatedAt;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
      insertedAt,
    };

    books.push(newBook);

    console.log('book is added to books array: ', books);

    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    }).code(201);
  } catch (error) {
    console.log('error in postBookHandler: ', error);
    h.response(failResponse).code(500);
  }
};

exports.getAllBooksHandler = (request, h) => {
  try {
    const responseBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
    return h.response({
      status: 'success',
      data: { books: responseBooks },
    }).code(200);
  } catch (error) {
    console.log(error);
  }
};

exports.getBookHandler = (request, h) => {
  try {
    const { bookId } = request.params;

    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      }).code(404);
    }

    const book = books[bookIndex];
    return h.response({
      status: 'success',
      data: { book },
    }).code(200);
  } catch (error) {
    console.log(error);
  }
};

exports.updateBookHandler = (request, h) => {
  const { name, readPage } = request.payload;
  const { bookId } = request.params;

  const targetBookIndex = books.findIndex((book) => book.id === bookId);

  if (targetBookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > books[targetBookIndex]) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  books[targetBookIndex] = request.payload;

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

exports.deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  if (books.findIndex(({ id }) => id === bookId) === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  const updatedBooks = books.filter(({ id }) => id !== bookId);

  books = updatedBooks;

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};
