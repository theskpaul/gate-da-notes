class Stack:
    def __init__(self):
        self.__stack: list = []

    def size(self):
        """
        `size()`: Returns the size of the stack.
        """
        return len(self.__stack)

    def isEmpty(self) -> bool:
        """
        `isEmpty()`: Returns whether the stack is empty.
        """
        return self.size() == 0

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
            return self.__stack.pop()

    def peek(self):
        """
        `peek()`: Returns the top element of the stack, and `None` if empty.
        """
        return None if not self.__stack else self.__stack[-1]

    def display(self):
        """
        `display()`: Returns all the elements in the stack.
        """
        return list(self.__stack)
