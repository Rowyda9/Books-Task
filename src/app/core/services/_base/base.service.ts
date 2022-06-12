import { Injectable } from '@angular/core';
import { Base } from '@models/base.model';

@Injectable()
export class BaseService<T extends Base> {
  protected localStorageKey!: string;

  constructor() {}
  /**
   * get ts details
   *
   *
   * @param id
   */
  get(id: number): T {
    return this.list().find(t => t.id === id)!;
  }

  /**
   * list all Ts
   *
   *
   */
  list(): T[] {
    return ((JSON.parse(localStorage.getItem(this.localStorageKey) ?? '[]')) as T[])
    .sort((a, b) => a.id - b.id);
  }



  /**
   * create new item
   *
   *
   * @param body
   */
  create(body: T): any {
    const list = this.list();
    body.id = list.length + 1;
    list.push(body);
    localStorage.setItem(this.localStorageKey, JSON.stringify(list));
    return list;
  }

  /**
   * update t
   *
   *
   * @param body
   */
  update(body: T): any {
    debugger
    const list = this.list();
    const index = list.findIndex(t => t.id === body.id);
    list[index] = body;
    localStorage.setItem(this.localStorageKey, JSON.stringify(list));
    return list;
  }

  /**
   * delete t
   *
   *
   * @param id
   */
  delete(id: number): boolean {
    try {
      const list = this.list();
      const index = list.findIndex(t => t.id === id);
      if (index > -1) {
        list.splice(index, 1);
        localStorage.setItem(this.localStorageKey, JSON.stringify(list));
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }

  }

}
