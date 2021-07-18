/* eslint-disable new-cap */
const { nanoid } = require('nanoid');

const books = [];

exports.postBookHandler = (request, h) => {
  try {
    let failResponse = JSON.stringify({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });

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
    }).code(200);
  } catch (error) {
    console.log('error in postBookHandler: ', error);
    h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    }).code(500);
  }
};

exports.getAllBooksHandler = (response, h) => {
  try {
    return h.response({
      status: 'success',
      data: { books },
    }).code(200);
  } catch (error) {
    console.log(error);
  }
};
