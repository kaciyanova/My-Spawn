#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc,char **argv)
{
	int flag=1;

	while(flag)
	{
		printf("1 - say hello \n");
		printf("2 - say goodbye \n");
		printf("0 - exit\n");
		printf("Enter choice - \n");

		char buffer[10];
		fgets(buffer,10,stdin);
		int number = atoi(buffer);

		switch(number)
		{
			case 1:
			printf("Hello World!\n");
			break;

			case 2:
			printf("Goodbye (cruel) World!\n");
			break;

			case 3:
			printf("Exiting!\n");
			flag=0;
			break;

			default:
			printf("***INVALID INPUT***\n");
			break;
		}
	}
	return 0;
}