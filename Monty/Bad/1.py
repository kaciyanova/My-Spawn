name=raw_input("Please enter your name:")
age=int(raw_input("What year were you born? "))
cent=age+100

print name,",you will turn 100 in the year",cent,"."

n=int(raw_input("How many copies of this message would you like? "))

while n>0:
	print name,",you will turn 100 in the year",cent,"\n"
	n-=1