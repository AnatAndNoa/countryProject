using countryProj.BL;
using Microsoft.AspNetCore.Mvc;

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountrySharesController : ControllerBase
    {
        [HttpGet("country/{countryCode}")]
        public List<CountryShare> GetByCountry(
            string countryCode)
        {
            CountryShare share =
                new CountryShare();

            return share.ReadByCountry(
                countryCode
            );
        }

        [HttpGet("user/{userId}")]
        public List<CountryShare> GetByUser(
            int userId)
        {
            CountryShare share =
                new CountryShare();

            return share.ReadByUser(
                userId
            );
        }

        [HttpPost]
        public int Post(
            [FromBody] CountryShare share)
        {
            return share.Insert();
        }

        [HttpPut("{shareId}/{userId}")]
        public bool Put(
            int shareId,
            int userId,
            [FromBody] CountryShare share)
        {
            return share.Update(
                shareId,
                userId
            );
        }

        [HttpDelete("{shareId}/{userId}")]
        public bool Delete(
            int shareId,
            int userId)
        {
            CountryShare share =
                new CountryShare();

            return share.Delete(
                shareId,
                userId
            );
        }
    }
}