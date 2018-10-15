lst=[]

#takes filename of uninstall list for wmic product get name, each on newline, can technically 
#separate by commas but imo it's more legible to have a list
fn=raw_input("Please enter uninstall list filename: ")


#extension read
with open(fn) as f:
	lst=f.read().splitlines()
f.close()

def Extensions():
	#i mean.,.,.,., tabbycat isn't exactly something u get in the code normally also i was lazy
	string='wmic product where name="tabbycat" call uninstall /nointeractive'


	ext="tabbycat"

	code=""

	for x in lst:
		nstring=string.replace(ext,x)
		code=code+"\n"+nstring+"\n"
	print code


Extensions()

#pls like,, idk don't claim u made this i spent like, a good hour of my life on this?? please