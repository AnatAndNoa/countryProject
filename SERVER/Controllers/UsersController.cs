using Microsoft.AspNetCore.Mvc;
using countryProj.BL;

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/Users
        [HttpGet]
        public IEnumerable<User> Get()
        {
            User user = new User();
            return user.Read();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Users
        [HttpPost]
        public int Post([FromBody] User user)
        {
            return user.Insert();
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public ActionResult<User> Login(
            [FromBody] User user)
        {
            User loggedInUser = user.Login();

            if (loggedInUser == null)
            {
                return Unauthorized();
            }

            return Ok(loggedInUser);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public bool Put(
            int id,
            [FromBody] User user)
        {
            return user.UpdateUser(id);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public bool Delete(int id)
        {
            User user = new User();
            return user.DeleteById(id);
        }
    }
}