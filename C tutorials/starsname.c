#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc,char **argv)
{

		for (;;){
								char name[50];
char croppedName[50];

		printf("gimme ya fuckin name!!");
				fgets(name,50,stdin);

				if (name==0)
				{
break;				}
		int length=strlen(name)+2;
int nameLength=strlen(name);
strtok(name,"\n");

for (int i=0;i<=length; i++)
		{
						printf("*");
		}
		printf("\n");
						printf("*");
						printf(" ");
						printf(name);
						printf(" ");
						printf("*");
		printf(" \n");
							
							for (int i=0;i<=length; i++)
		{
						printf("*");
		}
break;	}
}