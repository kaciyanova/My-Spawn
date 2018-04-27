from random import randint

x=randint(0,6)


b=1

while b==1:
	a=raw_input("Roll again? (y/n)")
	if a=="n":
		
		break
	elif a=="y":
		x=randint(1,6)
		print x
	else:
		print "Please enter a valid answer"
		a=raw_input("Roll again? (y/n)")