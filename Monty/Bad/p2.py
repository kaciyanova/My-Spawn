import math
import cmath

#for user prompt to calculate another eq
cont="y"

while cont=="y":
	#user inputs
	a=float(raw_input("Please enter coefficient a: "))
	b=float(raw_input("Please enter coefficient b: "))
	c=float(raw_input("Please enter coefficient c: "))

	#linear equation
	if a==0:
		r=(-c)/b
		print "Linear equation; one root: ",r
		cont=raw_input("Would you like to calculate another quadratic equation? (y/n): ")

	#complex roots
	elif ((b**2)-(4*a*c))<0:
		discr=(-((b**2)-(4*a*c)))**.5

	#complex discriminant
		cdiscr=complex(0,discr)
		r1=(-b+cdiscr)/(2*a)
		r2=(-b-cdiscr)/(2*a)
		print "Root 1: ",r1
		print "Root 2: ",r2
		cont=raw_input("Would you like to calculate another quadratic equation? (y/n): ")

	#general calculation
	else:
		r1=(-b+(((b**2)-(4*a*c))**0.5))/(2*a)
		r2=(-b-(((b**2)-(4*a*c))**0.5))/(2*a)

		#double root
		if r1==r2:	
			print "Root: ",r1," (double root)"
			cont=raw_input("Would you like to calculate another quadratic equation? (y/n): ")
		else:
			print "Root 1: ",r1
			print "Root 2: ",r2
			cont=raw_input("Would you like to calculate another quadratic equation? (y/n): ")



	