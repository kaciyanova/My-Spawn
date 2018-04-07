#include <stdio.h>
#include <string.h>
#include <stdlib.h>

double CalculateWage(double rate,double hours)
{
	return rate*hours;
}

void RemoveNewline(char *str)
{
	int len=strlen(str);
	if(len>0&&str[len-1]=='\n')
	{
		str[len-1]='\0';
	}
}

int main(int argc,char **argv)
{
	int flag=1;
	while(flag!=0)
	{
		char name[50];
		char number[10];
		printf("Please enter your name: ");
		fgets(name,50,stdin);
		RemoveNewline(name);

		if(strcmp(name,"0")==0)
		{
			flag=0;
			continue;
		}
		printf("Enter hourly rate: ");
		fgets(number,10,stdin);
		double rate=atof(number);
		printf("Enter hours: ");
		fgets(number,10,stdin);
double hours=atof(number);
double wage=CalculateWage(rate,hours);
printf("Wage for %s: %.2f\n",name,wage );
	}
	printf("Goodbye!");

	return 0;
}