using countryProj.BL;
using Microsoft.AspNetCore.Mvc;

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCountriesController : ControllerBase
    {
        [HttpPost]
        public int Post([FromBody] UserCountry userCountry)
        {
            return userCountry.Insert();
        }

        [HttpDelete("{userId}/{countryCode}")]
        public bool Delete(
            int userId,
            string countryCode)
        {
            UserCountry userCountry =
                new UserCountry();

            userCountry.UserId = userId;
            userCountry.CountryCode = countryCode;

            return userCountry.Delete();
        }

        [HttpGet("visited/{userId}")]
        public List<UserCountry> GetVisited(int userId)
        {
            UserCountry userCountry =
                new UserCountry();

            return userCountry.ReadVisited(userId);
        }

        [HttpGet("wantToVisit/{userId}")]
        public List<UserCountry> GetWantToVisit(int userId)
        {
            UserCountry userCountry =
                new UserCountry();

            return userCountry.ReadWantToVisit(userId);
        }
    }
}