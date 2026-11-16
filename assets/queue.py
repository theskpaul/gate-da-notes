class Queue:
    def __init__(self):
        self.queue: list = []

    def size(self):
        return len(self.queue)

    def isEmpty(self) -> bool:
        return self.size() == 0

    def enqueue(self, value):
        if value is None:
            raise ValueError("queue does not accept None")
        else:
            self.queue.append(value)

    def dequeue(self):
        if self.size() == 0:
            return None
        else:
            return self.queue.pop(0)

    def peek(self):
        if self.isEmpty():
            return None
        else:
            return self.queue[0]

    def display(self):
        if self.isEmpty():
            return []
        else:
            return list(self.queue)
