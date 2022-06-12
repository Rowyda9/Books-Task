import { Injectable } from '@angular/core';
import { defaultBooks } from '@constants/book-list';
import { LocalStorage } from '@constants/local-storage';
import { Book } from '@models/book/book.model';
import { BaseService } from '@services/_base/base.service';

@Injectable({
  providedIn: 'root'
})
export class BookService extends BaseService<Book> {
  protected override localStorageKey = LocalStorage.BooksRepo;



  /**
   * list all Books
   *
   *
   */
    listAll(): Book[] {
    return ((JSON.parse(localStorage.getItem(this.localStorageKey) ?? '[]')) as Book[])
    .sort((a, b) => a.order - b.order);
  }

    /**
   * create new item
   *
   *
   * @param body
   */
     override create(body: Book): any {
      const list = this.list();
      body.id = list.length + 1;
      body.order = list.length + 1;
      list.push(body);
      localStorage.setItem(this.localStorageKey, JSON.stringify(list));
      return list;
    }

   /**
   * Delete list all Books
   *
   *
   */
  deleteAll(): any {
    localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    return true;
  }

  /**
   * Add list of Books
   *
   *
   */
  addList(){

    const books = defaultBooks;
    localStorage.setItem(this.localStorageKey, JSON.stringify(books));
  }


   /**
   * change  order of Books
   *
   *
   */
  changeOrder(bookToChangeOrder: Book, bookOfCurrentOrder: Book): any {
    const books = this.list();
    const index = books.findIndex(b => b.id === bookToChangeOrder.id);
    const currentOrderIndex = books.findIndex(b => b.id === bookOfCurrentOrder.id);
    if (index === -1 || currentOrderIndex === -1) {
      return false;
    }
    books[index].order = books[currentOrderIndex].order;
    books[currentOrderIndex].order = bookToChangeOrder.order;
    localStorage.setItem(this.localStorageKey, JSON.stringify(books));
    books.sort((a, b) => a.order - b.order);
    return books;
  }

}
