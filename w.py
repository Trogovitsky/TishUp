a = int(input())
b = int(input())
c = int(input())

min_fives = max(0, (a * 3 + b - c + 2) // 3)  # округление вверх

print(min_fives)
