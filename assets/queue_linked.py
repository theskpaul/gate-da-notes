from LinkedListImpl import LinkedList


class Queue:
    def __init__(self):
        self.__queue: LinkedList = LinkedList()

    def size(self):
        """
        `size()`: Returns the size of the queue.
        """
        return self.__queue.size()

    def isEmpty(self) -> bool:
        """
        `isEmpty()`: Returns whether the queue is empty.
        """
        return self.__queue.isEmpty()

    def enqueue(self, value):
        """
        `enqueue()`: Inserts a new element in the queue.
        """
        if value is None:
            raise ValueError("queue does not accept None")
        else:
            self.__queue.append(value)

    def dequeue(self):
        """
        `dequeue()`: Removes the front element of the queue and returns it.
        """
        if self.size() == 0:
            return None
        else:
            return self.__queue.delete_at(1)

    def peek(self):
        """
        `peek()`: Returns the front element of the queue, and `None` if empty.
        """
        return self.__queue.first()

    def display(self):
        """
        `display()`: Returns all the elements in the queue as a list.
        """
        return self.__queue.as_list()
