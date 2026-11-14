import sys


def print_stack(s: list):
    if len(s) == 0:
        print("Empty Stack!")
    else:
        print(f"Stack: {s}")


if __name__ == "__main__":
    stack = []

    while True:
        print_stack(stack)
        print("1. Push")
        print("2. Pop")
        print("3. Peek")
        print("4. isEmpty")
        print("5. Exit")
        option = input(">> ").strip()

        match option:
            case "1":
                inp = input("Enter a value: ")
                stack.append(inp)
            case "2":
                if len(stack) > 0:
                    tmp = stack[-1]
                    stack.pop()
                    print(f"{tmp} popped!")
                else:
                    print("Stack is empty!")
            case "3":
                if len(stack) > 0:
                    print(f"Top value: {stack[-1]}")
                else:
                    print("Stack is empty!")

            case "4":
                if len(stack) > 0:
                    print("Stack is not empty!")
                else:
                    print("Stack is empty!")
            case "5":
                sys.exit()
            case _:
                print("Select a option number between 1 to 5!")
