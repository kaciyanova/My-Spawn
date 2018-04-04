#include <stdio.h>
#include <string.h>

int main(int argc,char **argv)
{
	char firstName[50];
	char lastName[50];
	char fullName[50];

	printf("Please enter your first name: ");
	fgets(firstName,50,stdin);

	int lenFirst=strlen(firstName);

	if(lenFirst>0&&firstName[lenFirst-1]=='\n')
		firstName[lenFirst-1]='\0';

	if(strcmp(firstName,"Kevin")==0)
		printf("Hey! Another Kevin! \n");
	else
		printf("Oh well\n");



	printf("Please enter your last name: ");
	fgets(lastName,50,stdin);

	int lenLast=strlen(lastName);

	if(lenLast>0&&lastName[lenLast-1]=='\n')
		lastName[lenLast-1]='\0';

	if(strcmp(lastName,"Kevin")==0&&strcmp(firstName,"Kevin")==0)
		printf("Your name is Kevin Kevin?!! \n");
	else if(strcmp(lastName,"Chalmers")==0)
		printf("of Secrets!\n");
	else
		printf("Oh Well! Guess I'll continue being rude!\n");

	fullName[0]='\0';
	strcat(fullName,firstName);
	strcat(fullName," ");
	strcat(fullName,lastName);

	printf("Your full name is %s, which is %d characters long \n",fullName,strlen(fullName));
	return 0;
}