from random import randint

print "Guess a number from 1 to 100"

num=randint(0,99)

print num

b=0

while b==0:
	x=int(raw_input("Guess:"))
	if x==num:
		print "Well done, you guessed right!"
		b=1
	else:
		if x<num:
			print "Too low, guess again!"
			b=0
		elif x>num:
			print "Too high, guess again!"
			b=0

