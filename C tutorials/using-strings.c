#include <stdio.h>
#include <string.h>

//aaaaaah
int main(int argc,char **argv)
{
	char msg_1[5]={'H','e','l','l','o'};
	char msg_2[8]={" World!"};
	char msg_3[9]={"Goodbye! \0"};
	char msg_4[]={"Compiler worked out my size!"};
	char *msg_5={"Compiler worked out my size too!"};

printf("%s \n",msg_1);
printf("%s \n",msg_2);
printf("%s \n",msg_3);
printf("%s \n",msg_4);
printf("%s \n",msg_5);

	return 0;
}