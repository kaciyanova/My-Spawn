lst=[]

#takes filename of extension list, each on newline, can technically 
#separate by commas but imo it's more legible to have a list
fn=raw_input("Please enter extension list filename: ")


#extension read
with open(fn) as f:
	lst=f.read().splitlines()
f.close()

def Extensions():
	#i mean.,.,.,., tabbycat isn't exactly something u get in the code normally also i was lazy
	string="""// Enable tabbycat
	extensionInfo.setState('tabbycat', extensionStates.REGISTERED)  
	loadExtension('tabbycat', getExtensionsPath('tabbycat'))"""	

	ext="tabbycat"

	code="""//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////MANUAL EXTENSIONS///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////"""+"\n"

	for x in lst:
		nstring=string.replace(ext,x)
		code=code+"\n"+nstring+"\n"
	print code

Extensions()

#pls like,, idk don't claim u made this i spent like, a good hour of my life on this?? please