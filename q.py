a = set(input().split())
n = input()
c = 0

while len(n) != 0:
    if n[0] not in a:
        c += 1
    n = n.replace(n[0], '')
print(c)

