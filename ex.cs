using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/[todo]")]
    public class TodoController : Controller
    {
        private readonly ITodoRepository _todoRepository;

        public TodoController(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        [HttpGet] //GET /apitodo
        public IEnumerable<TodoItem> GetAll()
        {
            return _todoRepository.GetAll();
        }

        [HttpGet("{id}", Name = "GetTodo")] //GET /apitodo/id
        public IActionResult GetById(long id)
        {
            var item = _todoRepository.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
    }
}