using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class TextController : MonoBehaviour {
	
	public Text text;
	
	private enum States {
		start,cell,cell_b,cell_m,cellbm,bed,bed_v,bed_t,bed_b,bed_bv,bed_m,bed_mv,bed_mt,bed_bm,bed_bmv,mir,mir_v,mir_t,
		mir_b,mir_bv,mir_bt,mir_m,mir_mv,mir_bm,mir_bmv,lck,lock_v,lock_t,lock_m,lock_mv,lock_mt,lock_b,lock_bv,lock_bt,
		lock_bm,lock_bmv,lock_bmt,unlock,hall,hall_g,hall_f,stair,stair_v,stair_g,stair_gv,stair_f,stair_fv,
		stair_ft,guard,guard_v,guard_s,guard_g,guard_gv,guard_gs,guard_f,guard_fv,guard_fs,outs,outs_v,mirror,mirend,keys,
		keyend,gun,gunend,run,runend,ending
	};
	private States myState;
	
	// Use this for initialization
	void Start () {
		myState = States.start;	
	}
	
	// Update is called once per frame
	void Update () {
		print (myState);
		if 		(myState==States.start)		{start();}
		else if (myState==States.ending)	{ending();}
		
		else if (myState==States.cell)		{cell();}//after sheets picked up
		else if (myState==States.cell_b)	{cell_b();}//after sheets picked up
		else if (myState==States.cell_m)	{cell_m();}//after mirror picked up
		else if (myState==States.cellbm)	{cellbm();}//after mirror+sheets picked up
		
		else if (myState==States.bed)		{bed();}
		else if (myState==States.bed_v)		{bed_v();}
		else if (myState==States.bed_t)		{bed_t();}
		else if (myState==States.bed_b)		{bed_b();}//after picked up sheets
		else if (myState==States.bed_bv)	{bed_bv();}
		else if (myState==States.bed_m)		{bed_m();}
		else if (myState==States.bed_mv)	{bed_mv();}
		else if (myState==States.bed_mt)	{bed_mt();}
		else if (myState==States.bed_bm)	{bed_bm();}//after picked up sheets+mirror
		else if (myState==States.bed_bmv)	{bed_bmv();}
		
		else if (myState==States.mir)		{mir();}
		else if (myState==States.mir_v)		{mir_v();}
		else if (myState==States.mir_t)		{mir_t();}
		else if (myState==States.mir_b)		{mir_v();}
		else if (myState==States.mir_bv)	{mir_bv();}
		else if (myState==States.mir_bt)	{mir_bt();}
		else if (myState==States.mir_m)		{mir_m();}
		else if (myState==States.mir_mv)	{mir_mv();}
		else if (myState==States.mir_bm)	{mir_bm();}
		else if (myState==States.mir_bmv)	{mir_bmv();}
		
		else if (myState==States.lck)		{lck();}
		else if (myState==States.lock_v)	{lock_v();}
		else if (myState==States.lock_t)	{lock_t();}
		else if (myState==States.lock_m)	{lock_m();}
		else if (myState==States.lock_mv)	{lock_mv();}
		else if (myState==States.lock_mt)	{lock_mt();}
		else if (myState==States.lock_b)	{lock_b();}
		else if (myState==States.lock_bv)	{lock_bv();}
		else if (myState==States.lock_bt)	{lock_bt();}
		else if (myState==States.lock_bm)	{lock_bm();}
		else if (myState==States.lock_bmv)	{lock_bmv();}
		else if (myState==States.lock_bmt)	{lock_bmt();}
		
		else if (myState==States.unlock)	{unlock();}
		
		else if (myState==States.hall)		{hall();}
		else if (myState==States.hall_g)	{hall_g();} //dead guard
		else if (myState==States.hall_f)	{hall_f();} //searched guard
		
		else if (myState==States.stair)		{stair();}
		else if (myState==States.stair_v)	{stair_v();}
		else if (myState==States.stair_g)	{stair_g();}
		else if (myState==States.stair_gv)	{stair_gv();}
		else if (myState==States.stair_f)	{stair_f();}
		else if (myState==States.stair_fv)	{stair_fv();}
		else if (myState==States.stair_ft)	{stair_ft();}
		
		else if (myState==States.guard)		{guard();}
		else if (myState==States.guard_v)	{guard_v();}
		else if (myState==States.guard_s)	{guard_s();}
		else if (myState==States.guard_g)	{guard_g();}
		else if (myState==States.guard_f)	{guard_f();}
		else if (myState==States.guard_gv)	{guard_gv();}//dead
		else if (myState==States.guard_gs)	{guard_gs();}//empty
		else if (myState==States.guard_fv)	{guard_fv();}
		else if (myState==States.guard_fs)	{guard_fs();}
		
		else if (myState==States.outs)		{outs();}
		else if (myState==States.outs_v)	{outs_v();}
		
		
		else if (myState==States.mirror)	{mirror();}
		else if (myState==States.mirend)	{mirend();}
		
		else if (myState==States.keys)		{keys();}
		else if (myState==States.keyend)	{keyend();}
		
		else if (myState==States.gun)		{gun();}
		else if (myState==States.gunend)	{gunend();}
		
		else if (myState==States.run)		{run();}
		else if (myState==States.runend)	{runend();}
	}
	
	//start screen
	void start(){
		text.text="Press Space to Start";
		
		if		(Input.GetKeyDown(KeyCode.Space))	{myState=States.cell;}}
	
	
	///////////////////////CELL///////////////////////	
	//init	
	void cell(){
		text.text="You jerk awake to a dimly-lit, cold room, a dull throbbing in your head."+
			"\nYou do not remember who you are, or how you got here.\nThere are some dirty sheets on the bed, a mirror "+
				"on the wall, and the door appears to be locked from the outside.\n\n"+
				"Press B to go to bed\nPress M to go to mirror\nPress D to go to door";
		
		if 		(Input.GetKeyDown(KeyCode.B))	{myState=States.bed;}
		else if (Input.GetKeyDown(KeyCode.M))	{myState=States.mir;}
		else if (Input.GetKeyDown(KeyCode.D))	{myState=States.lck;} }
	
	void bed(){
		text.text="You walk over to the bed.\n\nPress L to look at bed\nPress T to take sheets"+
			"\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell;}
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.bed_v;}
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.bed_t;}	}
	
	void bed_v(){
		text.text="The sheets on the bed are in a sorry state. You shudder at the thought of how long you may have "+
			"been lying in them. Is that vomit?\n\nPress T to pick up sheets\nPress R to return to roaming the cell"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell;} 
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.bed_t;}	}
	
	
	void bed_t(){
		text.text="You gingerly pick up the sheets. Several dessicated cockroaches tumble onto the floor as you do."+
			"\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;} }
	
	void mir(){
		text.text="You walk over to the mirror.\n\nPress L to look at mirror\nPress T to take mirror"+
			"\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell;}	
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.mir_v;}
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.mir_t;}	}					
	
	void mir_v(){
		text.text="You look into the mirror. A hollow-eyed, starved looking person looks back at you. "+
			"You do not recognise them.\n\nPress T to take mirror\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell;}	
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.mir_t;}	}					
	
	void mir_t(){
		text.text="You carefully take the mirror off the nail it is hanging from. "+
			"Several spiders scuttle indignantly away as the mirror tears their webs from the wall."+
				"\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;}}	
	
	void lck(){
		text.text="You walk over to the door.\n\nPress L to look at door\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell;}	
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.lock_v;}
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_t;}}

	
	void lock_v(){
		text.text="There is a small barred window in the door. You peer out of it and catch sight of a sleeping guard. "+
			"There also appears to be a keypad just in reach, but you cannot see the keys. "+
				"\n\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell;}	
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_t;}}
	
	void lock_t(){
		text.text="The door is locked from the outside. You throw your weight against it, but gain nothing more than a bruised shoulder."+
			"\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell;}	}
	
	//m		
	void cell_m(){
		text.text="You are in a dimly-lit, cold room."+
			"\nThere are some dirty sheets on the bed, a bent nail "+
				"in the wall, and the door appears to be locked from the outside.\n\n"+
				"Press B to go to bed\nPress M to go to mirror\nPress D to go to door";
		
		if (Input.GetKeyDown(KeyCode.B))		{myState=States.bed_m;}
		else if (Input.GetKeyDown(KeyCode.M))	{myState=States.mir_m;}
		else if (Input.GetKeyDown(KeyCode.D))	{myState=States.lock_m;} }
	
	void bed_m(){
		text.text="You walk over to the bed.\n\nPress L to look at bed\nPress T to take sheets"+
			"\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;}
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.bed_mv;}
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.bed_mt;}	}
	
	void bed_mv(){
		text.text="The sheets on the bed are in a sorry state. You shudder at the thought of how long you may have "+
			"been lying in them. Is that vomit?\n\nPress T to pick up sheets\nPress R to return to roaming the cell"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;} 
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.bed_mt;}	}
	
	
	void bed_mt(){
		text.text="You gingerly pick up the sheets. Several dessicated cockroaches tumble onto the floor as you do."+
			"\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;} }		
	
	void mir_m(){
		text.text="You walk over to the nail in the wall.\n\n Press L to look at nail"+
			"\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;}	
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.mir_mv;}}
	
	void mir_mv(){
		text.text="There is a rusted nail hammered crookedly into the wall. A single spider is forlornly "+
			"spinning a new web on it.\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;}	}
	
	void lock_m(){
		text.text="You walk over to the door.\n\nPress L to look at door\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;}
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_mt;}
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.lock_mv;}}
	
	void lock_mv(){
		text.text="There's a small barred window in the door. You peer out of it and catch sight of a sleeping guard. "+
			"There also appears to be a keypad just in reach, but you cannot see the keys. "+
				"\n\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;}	
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_mt;}}
	
	void lock_mt(){
		text.text="With a bit of effort, you position the mirror so you can see the keypad. Several keys have greasy "+
			"fingerprints on them. After a few minutes of trying different combinations, the door clicks open."+
				"\n\nPress O to open the door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_m;}	
		if (Input.GetKeyDown(KeyCode.O))		{myState=States.unlock;}	}													
	
	
	//b	
	void cell_b(){
		text.text="You are in a dimly-lit, cold room."+
			"\nThere is a bare, rickety bed, a mirror on the wall, and the door appears to be locked from the outside."+
				"\n\nPress B to go to bed\nPress M to go to mirror\nPress D to go to door";
		
		if (Input.GetKeyDown(KeyCode.B))		{myState=States.bed_b;}
		else if (Input.GetKeyDown(KeyCode.M))	{myState=States.mir_b;}
		else if (Input.GetKeyDown(KeyCode.D))	{myState=States.lock_b;} }
	
	void bed_b(){
		text.text="The bed is empty, save for the squashed remains of a cockroach and an old stain that looks"+
			" suspiciously like blood.\n\nPress R to return to roaming the cell"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;}	}	
	
	void bed_bv(){
		text.text="The bed is empty, save for the squashed remains of a cockroach and an old stain that looks"+
			" suspiciously like blood.\n\nPress R to return to roaming the cell"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;} }
	
	void mir_b(){
		text.text="You walk over to the mirror.\n\nPress L to look at mirror\nPress T to take mirror"+
			"\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;}	
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.mir_v;}}
	
	void mir_bv(){
		text.text="You look into the mirror. A hollow-eyed, starved looking person looks back at you. "+
			"You do not recognise them.\n\nPress T to take mirror\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;}	
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.mir_bt;}	}					
	
	void mir_bt(){
		text.text="You carefully take the mirror off the nail it is hanging from. "+
			"Several spiders scuttle indignantly away as the mirror tears their webs off the wall."+
				"\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;}}						
	
	void lock_b(){
		text.text="You walk over to the door.\n\nPress L to look at door\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;}	
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.lock_v;}
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_bt;}}

	
	void lock_bv(){
		text.text="There's a small barred window in the door. You peer out of it and catch sight of a sleeping guard. "+
			"There also appears to be a keypad just in reach, but you cannot see the keys. "+
				"\n\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;}	
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_bt;}}
	
	void lock_bt(){
		text.text="You toss the dirty sheets against the door. They land on the floor with a sad whump. "+
			"Why did you even think that would help?\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cell_b;}		}			
	
	
	//bm
	void cellbm(){
		text.text="You are in a dimly-lit, cold room."+
			"\nThere is a bare, rickety bed, a nail "+
				"in the wall, and the door appears to be locked from the outside.\n\n"+
				"Press B to go to bed\nPress N to go to nail\nPress D to go to door";
		
		if (Input.GetKeyDown(KeyCode.B))		{myState=States.bed_bm;}
		else if (Input.GetKeyDown(KeyCode.N))	{myState=States.mir_bm;}
		else if (Input.GetKeyDown(KeyCode.D))	{myState=States.lock_bm;} }
	
	void bed_bm(){
		text.text="You walk over to the bed.\n\nPress L to look at bed\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;}
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.bed_bmv;}}	
	
	void bed_bmv(){
		text.text="The bed is empty, save for the squashed remains of a cockroach and an old stain that looks"+
			" suspiciously like blood.\n\nPress R to return to roaming the cell"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;} }
	
	void mir_bm(){
		text.text="You walk over to the nail in the wall.\n\n Press L to look at nail"+
			"\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;}	
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.mir_bmv;}}
	
	void mir_bmv(){
		text.text="There is a rusted nail hammered crookedly into the wall. A single spider is forlornly "+
			"spinning a new web on it.\n\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;}	}
	
	void lock_bm(){
		text.text="You walk over to the door.\n\nPress L to look at door\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;}
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_bmt;}
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.lock_bmv;}}
	
	void lock_bmv(){
		text.text="There's a small barred window in the door. You peer out of it and catch sight of a sleeping guard. "+
			"There also appears to be a keypad just in reach, but you cannot see the keys. "+
				"\n\nPress T to open door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;}	
		else if (Input.GetKeyDown(KeyCode.T))	{myState=States.lock_bmt;}}
	
	void lock_bmt(){
		text.text="With a bit of effort, you position the mirror so you can see the keypad. Several keys have greasy "+
			"fingerprints on them. After a few minutes of trying different combinations, the door clicks open."+
				"\n\nPress O to open the door\nPress R to return to roaming the cell";
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.cellbm;}	
		if (Input.GetKeyDown(KeyCode.O))		{myState=States.unlock;}	}	
	
	//unlock
	void unlock(){
		text.text="You quietly open the door and step through it into a hallway. The door clicks locked behind you."+
			"\n\nPress C to continue";
		
		if (Input.GetKeyDown(KeyCode.C))		{myState=States.hall;}	}
	
	
	
	///////////////////////HALLWAY///////////////////////
	
	//init
	void hall(){
		text.text="You're in a long hallway. A guard snores away loudly in a chair by the cell door. Ahead, you can make"+
			" out some stairs with a door at the top.\n\nPress G to go to guard\nPress S to go to stairs";
		
		if 		(Input.GetKeyDown(KeyCode.G))	{myState=States.guard;}
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.stair;}}
	
	void guard(){
		text.text="You walk over to the guard sleeping in the chair by the door.\n\nPress L to look at guard\n"+
			"Press R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall;} 
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.guard_v;}}
	
	void guard_v(){
		text.text="The guard snoozes away, oblivious to their escaped charge. An empty crisp packet sits in their lap."+
			"There's a bunch of keys and a gun on their belt. You'll have to make sure they can't raise the alarm if they wake up."+
				"\n\nPress S to strangle guard\nPress R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall;} 		
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.guard_s;}	}			
	
	void guard_s(){
		text.text="You take a deep breath and steel yourself. It's them or you, you tell yourself. You surge forward"+
			", tackling the guard to the floor, knees pinning their shoulders to the ground. Your hand smothers their"+
				" screams as you pinch their nose shut. The guard thrashes against you, but their struggles grow weaker "+
				"by the second. They have long since grown still by the time you roll off them, hands shaking.\n\nPress "+
				"S to search guard\nPress R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall_g;} 		
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.guard_gs;}	}	
	//FOUR TWENTY AND ABLAZE
	void stair(){
		text.text="You walk up the stairs, stopping before the door at the top.\n\nPress L to look at door\n"+
			"Press R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall;} 
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.stair_v;}}		
	
	void stair_v(){
		text.text="The door is locked with a similar combination lock to the previous one. Unfortunately, this keypad "+
			"lacks fingermarks. You try the previous combination to no avail. What could the passcode be?"+
				"\n\nPress R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall;}}
	
	//g
	void hall_g(){
		text.text="You're in a long hallway. The guard's body lies askew next to an upended chair by the cell door."+
			" Ahead, you can make out some stairs with a door at the top.\n\nPress G to go to guard\nPress S to go to stairs";
		
		if 		(Input.GetKeyDown(KeyCode.G))	{myState=States.guard_g;}
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.stair_g;}}
	
	void guard_g(){
		text.text="You walk over to the guard's body.\n\nPress L to look at guard\nPress S to search guard"+
			"\nPress R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall_g;} 
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.guard_gv;}}
	
	void guard_gv(){
		text.text="You look down at the guard's body, nausea and guilt roiling inside you."+
			"There's a bunch of keys and a gun on their belt."+
				"\n\nPress S to search guard\nPress R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall_g;} 		
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.guard_gs;}	}			
	
	void guard_gs(){
		text.text="You kneel down by the guard, trying not to look at the empty eyes that stare at the ceiling in frozen"+
			" terror. With fumbling fingers, you take the keys and gun off their belt. As soon as you're done, you stagger"+
				" away and fall to your hands and knees retching. "+
				"\n\nPress R to gather yourself and return to roaming the hallway"; 
		
		if 	(Input.GetKeyDown(KeyCode.R))		{myState=States.hall_f;} 	}	
	
	void stair_g(){
		text.text="You walk up the stairs, stopping before the door at the top.\n\nPress L to look at door\n"+
			"Press R to return to roaming the hallway"; 
		
		if 		(Input.GetKeyDown(KeyCode.R))	{myState=States.hall_g;} 
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.stair_gv;}}		
	
	void stair_gv(){
		text.text="The door is locked with a similar combination lock to the previous one. Unfortunately, this keypad "+
			"lacks fingermarks. You try the previous combination to no avail. What could the passcode be?"+
				"\n\nPress R to return to roaming the hallway"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.hall_g;}}
	
	//f
	void hall_f(){
		text.text="You're in a long hallway. The guard's body lies askew next to an upended chair by the cell door."+
			" Ahead, you can make out some stairs with a door at the top.\n\nPress G to go to guard\nPress S to go to stairs";
		
		if 		(Input.GetKeyDown(KeyCode.G))	{myState=States.guard_f;}
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.stair_f;}}
	
	void guard_f(){
		text.text="You walk over to the guard's body.\n\nPress L to look at guard\nPress S to search guard"+
			"\nPress R to return to roaming the hallway"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.hall_f;} 
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.guard_fv;}
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.guard_fs;}	}			

	
	void guard_fv(){
		text.text="You look down at the guard's body, nausea and guilt roiling inside you."+
			"\n\nPress S to search guard\nPress R to return to roaming the hallway"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.hall_f;} 		
		else if (Input.GetKeyDown(KeyCode.S))	{myState=States.guard_fs;}	}			
	
	void guard_fs(){
		text.text="You've already searched the guard, and certainly don't want to touch the corpse any more than you have"+
			" to. Even as you think about it, bile begins to rise in your throat.\nWhat have you done?"+
				"\n\nPress R to gather yourself and return to roaming the hallway"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.hall_f;} }		
	
	void stair_f(){
		text.text="You walk up the stairs, stopping before the door at the top.\n\nPress L to look at door\n"+
			"Press R to return to roaming the hallway"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.hall_f;} 
		else if (Input.GetKeyDown(KeyCode.L))	{myState=States.stair_fv;}}		
	
	void stair_fv(){
		text.text="The door is locked with a similar combination lock to the previous one. Unfortunately, this keypad "+
			"lacks fingermarks. You rifle through the bunch of keys and find a card with two strings of numbers scrawled"+
				" on it. You recognise one of them as the passcode to the cell door."+
				"\n\nPress O to unlock the door\nPress R to return to roaming the hallway"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.hall_f;}
		else if (Input.GetKeyDown(KeyCode.O))	{myState=States.stair_ft;}}
	
	void stair_ft(){
		text.text="You key in the passcode and the door clicks open "+
			"\n\nPress C to continue \nPress R to return to roaming the hallway"; 
		
		if (Input.GetKeyDown(KeyCode.R))		{myState=States.hall_f;}
		else if (Input.GetKeyDown(KeyCode.C))	{myState=States.outs;}	}
	
	
	///////////////////////OUTSIDE///////////////////////
	
	void outs(){
		text.text="The daylight blinds you as you step outside. You raise your hand to shield your face and blink as "+
			" your eyes adjust. How long were you locked up underground?\n\nPress L to look around";
		
		if 		(Input.GetKeyDown(KeyCode.L))	{myState=States.outs_v;}}
	
	void outs_v(){
		text.text="You cast a furtive look around. There are a few dilapidated shacks scattered around what looks to be "+
			" an old military base. A few guards amble about, evidently bored of patrolling. Ahead, you can make out "+
				"gates leading out to a thick forest. A way out! Now, what to do about the guards?\n\nPress M to examine"+
				" mirror\nPress K to examine keys\nPress G to examine gun\nPress R to make a run for it";
		
		if 		(Input.GetKeyDown(KeyCode.M))	{myState=States.mirror;}	
		else if (Input.GetKeyDown(KeyCode.K))	{myState=States.keys;}	
		else if (Input.GetKeyDown(KeyCode.G))	{myState=States.gun;}	
		else if (Input.GetKeyDown(KeyCode.R))	{myState=States.run;}	}
	
	
	void mirror(){
		text.text="You turn the mirror over in your hands. An idea dawns on you. You place it on the ground and smash it "+
			"with a carefully placed boot. You pick up one of the larger jagged pieces and wrap it carefully in a strip"+
				" of shirt you've torn off. You're pretty sure you could quietly slit some throats with this, if you can "+
				"stomach it.\n\nPress L to look around\nPress E to attempt to sneak out, silently killing anyone who gets in your way";
		
		if 		(Input.GetKeyDown(KeyCode.L))	{myState=States.outs_v;}
		else if (Input.GetKeyDown(KeyCode.E))	{myState=States.mirend;}	}
	
	void keys(){
		text.text="The keys quietly jangle as you look at them. They could make quite a bit of noise if you threw them."+
			"\n\nPress L to look around\nPress K to throw keys to distract guards and attempt to sneak out";
		
		if 		(Input.GetKeyDown(KeyCode.L))	{myState=States.outs_v;}
		else if (Input.GetKeyDown(KeyCode.K))	{myState=States.keyend;}	}
	
	void gun(){
		text.text="You check the gun. Just enough bullets to kill the guards you can see. The gun lacks a silencer."+
			" Once you start firing, you'll have to kill anyone that comes for you."+
				"\n\nPress L to look around\nPress E to attempt to sneak out, killing anyone who gets in your way";
		
		if 		(Input.GetKeyDown(KeyCode.L))	{myState=States.outs_v;}
		else if (Input.GetKeyDown(KeyCode.E))	{myState=States.gunend;}}
	
	void run(){
		text.text="You think that if you could run fast enough, you could make it into the woods before anyone notices. "+
			"Will you take the risk and make a run for it?"+
				"\n\nPress L to look around\nPress E to attempt to run past the guards";
		
		if 		(Input.GetKeyDown(KeyCode.L))	{myState=States.outs_v;}
		else if (Input.GetKeyDown(KeyCode.E))	{myState=States.runend;}}
	
	///////////////////////ENDINGS///////////////////////
	void mirend(){
		text.text="You quietly slip through the shacks, coming up behind a guard trying to pick some food out of their teeth."+
			" You force a hand over their mouth as you slit their throat with your mirror shard. They fall to the ground"+
				" with an almost inaudible gurgle, blood pooling under them. Two more go the same way. By the time you reach "+
				"the forest you are drenched in blood. You run until your legs can't carry you, then crawl until you reach "+
				"a stream. You scrub your hands raw trying to get rid of the blood, yet you still feel its hot stickiness "+
				"long after the crimson has washed down the stream. You have escaped, but at what cost?";
				
		if 		(Input.GetKeyDown(KeyCode.Space))	{myState=States.ending;}}
	
	void keyend(){
		text.text="You throw the keys as hard as you can away from the gate. They crash through the windows of one of the "+
			"shacks. The noise sends the guards running to investigate, desperate for some action. You slip out the "+
				"gates and run as fast as your legs can carry you. You reach a small pond and wash the grime from your face."+
				" You wipe the water from your eyes and stifle a yell as the cell guard's dead eyes stare up at you from "+
				"the pond. You blink and look again. No one but the strange, ragged face you saw in the mirror stares back."+
				" You have escaped, but at what cost?";
		
		if 		(Input.GetKeyDown(KeyCode.Space))	{myState=States.ending;}}
	
	void gunend(){
		text.text="You take a deep breath, then run out to take cover behind a shack. None of the guards notice. A few "+
			"are preoccupied playing a card game on the stump of an old tree. You shoot them before they have the chance"+
				" to get up. You run, shooting wildly as shouts and gunshots ring out. You stumble as a bullet rips through"+
				" your shoulder. You barely feel it as you bolt out into the forest. You're still running long after the "+
				"shots have stopped. You stagger a final few steps, ears ringing and head spinning as you notice the blood"+
				" seeping down your torn shirt. A wave of burning pain sends you to the ground. You lie on the forest floor "+
				"writhing and screaming until the merciful fog of unconsciousness takes you.";
		
		if 		(Input.GetKeyDown(KeyCode.Space))	{myState=States.ending;}}
	
	void runend(){
		text.text="You wait until the guards turn their backs and bolt for the gate. You almost reach it when you hear a "+
			"shout from behind you. The shouting is soon joined by gunshots. The ground around you explodes into small"+
				" clouds of dust as the bullets bounce off it. You stumble as one hits you in the arm, soon followed by"+
				"another in your leg. You crumple to the ground as one punches you in the back, blinding pain radiating "+
				"through you. Through the haze of pain you can hear the muffled sounds of voices coming towards you. "+
				"Rough hands grab you and drag you away. Your eyes flutter open for a moment to see a trail of blood "+
				"behind you. You were so close. The darkness envelops you.";
		
		if 		(Input.GetKeyDown(KeyCode.Space))	{myState=States.ending;}}	
		
	void ending(){
		text.text="\n\n\t\t\t\t\t\t\t\t\t\t\t\tTHE END\n\n\t\t\t\t\t\t\t\t\tPress Space to play again";	
		
		if 		(Input.GetKeyDown(KeyCode.Space))	{myState=States.start;}}	

						
	
}