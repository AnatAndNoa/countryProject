using countryProj.BL;
using countryProj.DAL;
using Microsoft.AspNetCore.Mvc;

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteDataController : ControllerBase
    {
        // GET: api/SiteData/shares/today
        [HttpGet("shares/today")]
        public IEnumerable<CountryShare>
            GetTodayShares()
        {
            DBservices dbs =
                new DBservices();

            return dbs.ReadTodayShares();
        }

        // GET: api/SiteData/logins/today
        [HttpGet("logins/today")]
        public IEnumerable<UserLogin>
            GetTodayLogins()
        {
            DBservices dbs =
                new DBservices();

            return dbs.ReadTodayLogins();
        }

        // GET: api/SiteData/savedCountries/today
        [HttpGet("savedCountries/today")]
        public IEnumerable<UserCountry>
            GetTodaySavedCountries()
        {
            DBservices dbs =
                new DBservices();

            return dbs.ReadTodaySavedCountries();
        }

        // GET: api/SiteData/importedCountries/today
        [HttpGet("importedCountries/today")]
        public IEnumerable<Country>
            GetTodayImportedCountries()
        {
            DBservices dbs =
                new DBservices();

            return dbs.ReadTodayImportedCountries();
        }
    }
}