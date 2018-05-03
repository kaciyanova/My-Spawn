
name=raw_input("Enter contact name:")
number=raw_input("Enter contact number:")
email=raw_input("Enter contact email:")
address=raw_input("Enter contact address:")

details=[name,number,email,address]


print "Contact details:"
print "Name: ",name
print "Phone number: ",number
print "Email address: ",email
print "Address: ",address

correct=raw_input("Are these details correct? (y/n):")
while correct=="n":
	name=raw_input("Enter contact name:")
	number=raw_input("Enter contact number:")
	email=raw_input("Enter contact email:")
	address=raw_input("Enter contact address:")
	print "Contact details:"
	print "Name: ",name
	print "Phone number: ",number
	print "Email address: ",email
	print "Address: ",address
	correct=raw_input("Are these details correct? (y/n):")
else:
	with open("address.txt","a") as text:
		for x in details:
			text.write(x+"\n")
			text.write("\n")
		print "Contact information recorded."

