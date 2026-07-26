using countryProj.BL;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountrysController : ControllerBase
    {
        // GET: api/<CountrysController>
        [HttpGet]
        public IEnumerable<Country> Get()
        {
            Country country = new Country();
            return country.Read();
        }

        // GET api/<CountrysController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CountrysController>
        [HttpPost]
        public int Post([FromBody] Country country)
        {
            return country.Insert();
        }
        [HttpPost("import")]
        public async Task<int> ImportCountries()
        {
            return await Country.ImportCountriesFromAPI();
        }

        // PUT api/<CountrysController>/5
        [HttpPut("{code}")]
        public bool Put(string code, [FromBody] Country country)
        {
            return country.UpdateCountry(code);
        }

        // DELETE api/<CountrysController>/5
        [HttpDelete("{code}")]
        public bool Delete(string code)
        {
            Country country = new Country();
            return country.DeleteByCode(code);
        }
    }
}
