using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RESTful.Controllers
{
    [Route("api/[controller]")]
    public class Controller : Controller
    {
        public Hashtable<int, object> ht = new Hashtable<int, object>();{//using httables for the weak typing and speediness but might be wrong?

        };

    public GetAll(object){//lists all objects stored in memory
        return this.ht;
        }

        public Store(key,obj){//stores objects in memory
            Console.WriteLine("Please enter the object you would like to store ");
            object=Console.ReadLine();
            
            //VERY rough you'll need to change this to accommodate for all object types but u get the idea
            ht.Add(key,obj);
            //blah blah idk how 2 do http reqs in c# but here the gist
            POST /ht
            Data: name=obj;

            Console.WriteLine("Would you like to add another object? ");

        }

        public Del(key,obj){//deletes selected object
            ht.Remove(key,obj);

        }

        public GetSel(obj){//returns selected object
            ht.Get(obj)
        }

    }
}
