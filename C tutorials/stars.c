#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc,char **argv)
{
		for (;;){
				char buffer[10];
		printf("How many stars? (Enter 0 to quit) ");
		fgets(buffer,10,stdin);
		int number=atoi(buffer);
		if(!number){
		break;		}

		for (int i=0;i<=number; i++)
		{
			for(int j=0;j<i;j++)
			{
			printf("*");
							}
		printf("\n");

		}
	}
	
	
	printf("Bye!\n");
	return 0;
}