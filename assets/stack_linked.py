from LinkedListImpl import LinkedList


class Stack:
    def __init__(self):
        self.__stack: LinkedList = LinkedList()

    def size(self):
        """
        `size()`: Returns the size of the stack.
        """
        return self.__stack.size()

    def isEmpty(self) -> bool:
        """
        `isEmpty()`: Returns whether the stack is empty.
        """
        return self.__stack.isEmpty()

    def push(self, value):
        """
        `push()`: Inserts a new element in the stack.
        """
        if value is None:
            raise ValueError("stack does not accept None")
        else:
            self.__stack.append(value)

    def pop(self):
        """
        `pop()`: Removes the top element of the stack and returns it, or `None` if empty.
        """
        if self.size() == 0:
            return None
        else:
            return self.__stack.delete_at(self.size())

    def peek(self):
        """
        `peek()`: Returns the top element of the stack, and `None` if empty.
        """
        return self.__stack.last()

    def display(self):
        """
        `display()`: Returns all the elements in the stack.
        """
        return self.__stack.as_list()
