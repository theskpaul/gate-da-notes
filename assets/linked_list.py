import sys


class Node:
    def __init__(self, value, node) -> None:
        self.value = value
        self.node: Node = node


def print_list(head_node: Node | None):
    while head_node != None:
        print(head_node.value, end=" -> ")
        head_node = head_node.node
    print("None")


def ll_len(head_node: Node | None) -> int:
    count: int = 0

    if head_node != None:
        tmp: Node = head_node
        while tmp != None:
            count += 1
            tmp = tmp.node

    return count


def input2(msg="", try_again_msg="", type="undefined"):
    while True:
        value: str = input(msg)
        if type == "int":
            if value.isdecimal():
                i_value: int = int(value)
                return i_value
            else:
                print(try_again_msg)
        elif type == "undefined" or type == "str":
            return value


def insert(value, head_node: Node | None = None, append: bool = False) -> Node:
    """
    This insert function's job to to insert new nodes at the first or at the
    last of the linked list. It will return the whole linked list after insertion is done.

    It has thee parameters -
        1. value = It is the value that going to be stored in the nodes of the Linked List.
                   It doesn't have any fixed data type and default value, so it can be set
                   to anything and it is datatype agnostic.
        2. head_node = This parameter takes the current linked list as an input. It have two
                       datatypes `Node` and `None`. if any previous linked list have not been
                       given then it will utilise the `None` data type and return a new
                       Linked List, else it will use the given Linked List.
        3. append = This is a bool type parameter that sets in which (append or prepend. Here
                    prepend is the default method) order nodes are going to be inserted
                    into the Linked List (when a note empty Linked List is proved through)
                    `head_node`.
    """

    new_node = Node(value, None)

    if head_node != None:
        match append:
            case False:  # prepend
                new_node.node = head_node
                head_node = new_node

            case True:  # append
                tmp = head_node
                while tmp.node != None:
                    tmp = tmp.node
                tmp.node = new_node

    else:
        head_node = new_node

    return head_node


def insert_at(value, head_node: Node, position: int):
    new_node = Node(value, None)
    count = 1
    length = ll_len(head_node)
    tmp = head_node

    if length == 0:
        print("Linked List is Empty!")
        print(
            f"So, the input going to be inserted as the first node, not at the position {position}"
        )
        return insert(value=value)
    else:
        while position <= 0 or position > length + 1:
            print(
                "Position can not be lesser than 0 or greater than the Linked List +1 length."
            )
            position = input2(
                "Enter positon: ",
                try_again_msg="Position must be a decimal",
                type="int",
            )

        if position == 1:
            head_node = insert(value=value, head_node=head_node, append=False)
            return head_node
        elif position == length + 1:
            head_node = insert(value=value, head_node=head_node, append=True)
            return head_node

        while tmp.node != None:
            if count == position - 1:
                new_node.node = tmp.node
                tmp.node = new_node
                break

            else:
                tmp = tmp.node
                count += 1

    return head_node


def delete(value, head_node: Node):
    if head_node != None:
        curr = head_node

        if head_node.value == value:
            tmp = head_node
            head_node = head_node.node
            del tmp

            return head_node

        while curr.node != None:
            if curr.node.value == value:
                tmp = curr.node
                curr.node = curr.node.node
                del tmp
                break
            else:
                curr = curr.node
        else:
            print(f"Value: {value} not found!")
    else:
        print("Linked List is empty!")

    return head_node


def insert_method() -> bool:
    while True:
        print("Pick a method:")
        print("\t1. Prepend\t2. Append")
        order_method = input2(
            "..> ", try_again_msg="Input must be a decimal", type="int"
        )

        match order_method:
            case 1:
                return False
            case 2:
                return True
            case _:
                print("Select a correct option [1 or 2].")


if __name__ == "__main__":
    print("Linked List:")
    value = input2("Enter a value: ")
    sn: Node = insert(value=value)

    method: bool = insert_method()

    while True:
        print_list(head_node=sn)
        print(f"Length: {ll_len(head_node=sn)}")

        print("Select-")
        print("\t1. Insert\n\t2. Insert at\n\t3. Delete\n\t4. Stop")
        option = input2("..> ", try_again_msg="Input must be a decimal", type="int")

        match option:
            case 1:
                value = input2("Enter a value: ")
                sn = insert(value=value, head_node=sn, append=method)
            case 2:
                value = input2("Enter a value: ")
                inset_pos: int = input2(
                    "Enter positon: ",
                    try_again_msg="Position must be a decimal",
                    type="int",
                )
                sn = insert_at(value=value, head_node=sn, position=inset_pos)
            case 3:
                value = input2(
                    "Enter the value: ",
                    try_again_msg="Enter a value which you want to remove",
                )
                sn = delete(value=value, head_node=sn)
            case 4:
                sys.exit()
            case _:
                print("Select a correct option [1,2,3 or 4].")
