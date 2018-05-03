from random import randint



roll=0

die=raw_input("Which die would you like to use? ")

d20=randint(2,20)
d12=randint(2,12)
d6=randint(2,6)

if die=="d20":
	roll=d20
elif die=="d12":
	roll=d12
elif die=="d6":
	roll=d6
else:
	die=raw_input("Please choose from: d20, d12, or d6: ")



print roll


a=raw_input("Roll again? (y/n) ")

while a=="y":
	d20=randint(1,20)
	d12=randint(1,12)
	d6=randint(1,6)
	die=raw_input("Which die would you like to use? ")
	if die=="d20":
		roll=d20
	elif die=="d12":
		roll=d12
	elif die=="d6":
		roll=d6
	else:
		die=raw_input("Please choose from: d20, d12, or d6: ")
	print roll
	a=raw_input("Roll again? (y/n) ")
