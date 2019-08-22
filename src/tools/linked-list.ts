export interface Node<T> {
  item: T;
  next?: Node<T>;
  previous?: Node<T>;
}

export class LinkedList<T> {
  private readonly EMPTY_NODE: Node<T> = { item: {} as T, next: undefined };
  private head: Node<T> = this.EMPTY_NODE;
  private tail: Node<T> = this.EMPTY_NODE;

  public getHead = (): Node<T> => this.head;
  public getTail = (): Node<T> => this.tail;

  public insert = (value: T): LinkedList<T> => {
    const node = this.forgeNode(value);

    node.next = this.head;
    if (this.head) {
      this.head.previous = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }

    return this;
  };

  public append = (value: T): LinkedList<T> => {
    const node = this.forgeNode(value);

    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
      return this;
    }

    this.appendToTheEndOfTheList(node);
    return this;
  };

  public fromArray = (values: T[]): LinkedList<T> => {
    values.forEach(v => this.append(v));
    return this;
  };

  public toArray = (): T[] => {
    const result: T[] = [];
    this.iterate(_ => result.push(_));
    return result;
  };

  public size = (): number => {
    let listSize = 0;
    this.iterate(_ => listSize++);
    return listSize;
  };

  public isEmpty = () => !this.head || this.head === this.EMPTY_NODE;

  public *items() {
    let node = this.head;
    while (node.next) {
      yield node;
      node = node.next;
    }
    yield this.tail;
  }

  public iterate = (accept: (accept: T) => void) => {
    let node = this.head;
    while (node.next) {
      accept(node.item);
      node = node.next;
    }
  };

  private forgeNode = (value: T): Node<T> => {
    return { item: value, next: undefined };
  };

  private appendToTheEndOfTheList = (node: Node<T>) => {
    node.previous = this.tail;
    this.tail.next = node;
    this.tail = node;
  };
}
