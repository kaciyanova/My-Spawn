# include <stdio .h>
# include <stdlib .h>
# include <math .h>

int main ()
{
	char description[];
	printf("enter journey description: ");
	fgets(description,256,stdin);

	
	printf("enter journey coordinates, press enter to continue to next coordinate, enter 0 to finish: ");
	fgets(description,256,stdin);

	double d = dist (36.12 , -86.67 , 33.94 , -118.4) ;
 /* Americans don 't know kilometers */
	printf (" dist : %.1 f km (%.1 f mi .)\n", d, d / 1.609344) ;

	return 0;
}



# define R 6371
# define TO_RAD (3.1415926536 / 180)
double dist ( double th1 , double ph1 , double th2 , double ph2 )
{
	double dx , dy , dz;
	ph1 -= ph2;
	ph1 *= TO_RAD , th1 *= TO_RAD , th2 *= TO_RAD ;

	dz = sin (th1 ) - sin (th2 );
	dx = cos (ph1 ) * cos (th1 ) - cos (th2 );
	dy = sin (ph1 ) * cos (th1 );
	return asin ( sqrt (dx * dx + dy * dy + dz * dz) / 2) * 2 * R;
}

