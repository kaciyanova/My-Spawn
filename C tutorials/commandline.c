#include <stdio.h>
#include <string.h>

int main(int argc,char **argv)
{
	for(int i=0; i<argc; ++i)
	{
		printf("Argument %d: %s\n",i,argv[i] );
	}
	printf("All arguments printed. \n");

	return 0;
}