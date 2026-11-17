class Node:
    def __init__(self, data, next_node) -> None:
        self.data = data
        self.next = next_node


class LinkedList:
    """
    Linked List is a linear data structure that stores data as nodes. Each node also stores
    the address of the next node along with its data. These nodes are stored at random
    positions in memory; they are not stored in contiguous memory.

    There are mainly three types of Linked List -
    1. Singly Linked List
    2. Doubly Linked List
    3. Circular Linked List
    """

    def __init__(self) -> None:
        self.__length = 0
        self.__head = self.__tail = None

    def size(self) -> int:
        """
        `size()`: This method returns the number of elements that exist in the linked list.
        """
        return self.__length

    def isEmpty(self):
        """
        `isEmpty()`: This method determines whether the Linked List is empty or not.
        """
        return self.__head is None

    def prepend(self, value):
        """
        `prepend(value)`: Prepend method inserts a new node at the top of the Linked List and
                          sets that new node as the new head. It takes one input, which is the
                          data that is going to be stored in the new node.
        """
        if self.__head == None:
            self.__head = Node(data=value, next_node=self.__head)
            self.__tail = self.__head
            self.__length += 1
        else:
            self.__head = Node(data=value, next_node=self.__head)
            self.__length += 1

    def append(self, value):
        """
        `append(value)`: Append method inserts a new node at the end of the Linked List and
                         sets that new node as the new tail, whose next node is `None`.
                         It takes one input, which is the data that is going to be stored
                         in the new node.
        """
        if self.__head == None:
            self.__head = Node(data=value, next_node=self.__head)
            self.__tail = self.__head
            self.__length += 1
        else:
            self.__tail.next = Node(data=value, next_node=None)
            self.__tail = self.__tail.next
            self.__length += 1

    def insert(self, index, value) -> bool:
        """
        `insert(index, value)`: This method inserts a new node at the given position of the
                                Linked List. Positions start at 1, so index 1 inserts at the
                                head and index `size() + 1` inserts at the end. On an empty
                                list only index 1 is valid.

        Returns `True` if the node was inserted. Returns `False` (and leaves the list
        unchanged) if the index is less than 1 or greater than `size() + 1`.
        """
        if self.__head is not None:
            curr_index = 1
            curr = self.__head
            if index > self.size() + 1 or index <= 0:
                return False
            elif index == 1:
                self.prepend(value=value)
                return True
            elif index == self.size() + 1:
                self.append(value=value)
                return True
            else:
                while curr_index != index - 1:
                    curr = curr.next
                    curr_index += 1
                curr.next = Node(value, curr.next)
                self.__length += 1
                return True
        elif self.__head is None and index == 1:
            self.prepend(value=value)
            return True
        else:
            return False

    def delete(self, value) -> bool:
        """
        `delete(value)`: Delete method removes the first node whose data equals `value`,
                         found while traversing from the head to the tail.

        Returns `True` if a node was removed. Returns `False` if the list is empty or the
        value is not found.
        """
        if self.__head != None:
            if self.__head == self.__tail and self.__head.data == value:
                # tmp = self.__head
                self.__head = None
                self.__tail = None
                self.__length -= 1
                return True

            elif self.__head.data == value:
                # curr = self.__head
                self.__head = self.__head.next
                self.__length -= 1
                return True

            else:
                curr = self.__head
                while curr.next is not None:
                    if curr.next.data == value:
                        # tmp = curr.next
                        curr.next = curr.next.next
                        if curr.next is None:
                            self.__tail = curr
                        self.__length -= 1
                        return True
                    else:
                        curr = curr.next

        return False

    def delete_at(self, index):
        """
        `delete_at(index)`: Delete at method removes the node at the given position.
                            Positions start at 1, so index 1 removes the head and index
                            `size()` removes the tail.

        Returns the data if a node was removed. Returns `None` (and leaves the list
        unchanged) if the list is empty or the index is less than 1 or greater than `size()`.
        """
        if self.__head is not None:
            curr_index = 1
            curr = self.__head
            if index > self.size() or index <= 0:
                return None
            elif index == 1:
                tmp_data = self.__head.data
                self.delete(self.__head.data)
                return tmp_data
            elif index == self.size():
                while curr.next != self.__tail:
                    curr = curr.next
                tmp = curr.next
                self.__tail = curr
                curr.next = None
                self.__length -= 1
                return tmp.data

            else:
                while curr_index != index - 1:
                    curr = curr.next
                    curr_index += 1
                tmp = curr.next
                curr.next = curr.next.next
                self.__length -= 1
                return tmp.data
        else:
            return None

    def display(self) -> str:
        """
        `display()`: This method returns all the data as a string separated by commas.
                     An empty list returns an empty string.

        WARNING: This method may crash or produce an error for data that can't be converted
        into a string.
        """
        retn_str = ""
        if not self.isEmpty():
            tmp = self.__head
            while tmp != None:
                retn_str += str(tmp.data)
                if tmp.next != None:
                    retn_str += ", "
                tmp = tmp.next

        return retn_str

    def first(self):
        """
        `first()`: Returns `None` if the list is empty else the data.
        """
        return None if self.__head is None else self.__head.data

    def last(self):
        """
        `last()`: Returns `None` if the list is empty else the data.
        """
        return None if self.__tail is None else self.__tail.data

    def get(self, index):
        """
        `get(index)`: Returns the data of the node at the given index, and returns `None`
                      if it is empty or it doesn't exist.
        """
        if self.__head is not None:
            curr_index = 1
            curr = self.__head

            if index > self.size() or index <= 0:
                return None
            elif index == 1:
                return self.__head.data
            elif index == self.size():
                return self.__tail.data
            else:
                while curr_index != index:
                    curr = curr.next
                    curr_index += 1

                return curr.data
        else:
            return None

    def as_list(self) -> list:
        """
        `as_list()`: Converts the Linked List to a `list` and returns it.
        """

        retn_list = []
        curr = self.__head

        while curr != None:
            retn_list.append(curr.data)
            curr = curr.next

        return retn_list
