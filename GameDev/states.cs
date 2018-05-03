		if 		(myState==States.start)		{start();}
		else if (myState==States.cell)		{cell();}//after sheets picked up
		else if (myState==States.cell_b)	{cell_b();}//after sheets picked up
		else if (myState==States.cell_m)	{cell_m();}//after mirror picked up
		else if (myState==States.cell_bm)	{cell_bm();}//after mirror+sheets picked up
				
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
		else if (myState==States.stair_gt)	{stair_gt();}
		else if (myState==States.stair_f)	{stair_f();}
		else if (myState==States.stair_fv)	{stair_fv();}
		else if (myState==States.stair_ft)	{stair_ft();}
		
		else if (myState==States.guard)		{guard();}
		else if (myState==States.guard_v)	{guard_v();}
		else if (myState==States.guard_s)	{guard_s();}
		else if (myState==States.guard_g)	{guard_();}
		else if (myState==States.guard_gv)	{guard_xv();}//dead
		else if (myState==States.guard_gs)	{guard_xs();}//empty
		else if (myState==States.guard_fv)	{guard_fv();}
		else if (myState==States.guard_sv)	{guard_sv();}
		
		else if (myState==States.outs)		{outs();}
		else if (myState==States.outs_v)	{outsv();}
		
		else if (myState==States.outlook)	{outlook();}
		
		else if (myState==States.mirror)	{mirror();}
		else if (myState==States.mirend)	{mirend();}
		
		else if (myState==States.keys)		{keys();}
		else if (myState==States.keyend)	{keyend();}
		
		else if (myState==States.gun)		{gun();}
		else if (myState==States.gunend)	{gunend();}
		
		else if (myState==States.run)		{run();}
		else if (myState==States.runend)	{runend();}