#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc,char **argv)
{
	for ( char i = 'A'; i < 'A' + 26; i++)
	{
		printf ("%c %d\n", i, i);
	}
}