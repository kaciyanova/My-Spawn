shape=raw_input("Please enter a shape:")

if shape=="square":
	side=float(raw_input("Please enter length of side:"))
	area=side**2
	print "Area=",area
elif shape=="rectangle":
	height=float(raw_input("Please enter height:"))
	width=float(raw_input("Please enter width:"))
	area=width*height
	print "Area=",area
elif shape=="triangle":
	height=float(raw_input("Please enter height:"))
	base=float(raw_input("Please enter length of base:"))
	area=height*base/2
	print "Area=",area
elif shape=="circle":
	radius=float(raw_input("Please enter radius:"))
	area=3.14159*radius**2
	print "Area=",area
else:
	print ("Please enter a valid shape:")