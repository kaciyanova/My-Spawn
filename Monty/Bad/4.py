n=int(raw_input("Please enter a number: "))
l=n
lst=[]

while l>0:
	if n%l==0:
		lst.append(l)
	l-=1

print lst