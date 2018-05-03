a = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
s=[]

n=int(raw_input("Please enter a number: "))

s=[x for x in a if x<n]

print s