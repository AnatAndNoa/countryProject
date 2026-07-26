using countryProj.BL;
using Microsoft.AspNetCore.Mvc;

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalInfoController : ControllerBase
    {
        [HttpGet("available/continents")]
        public List<string> GetAvailableContinents()
        {
            UserContinent continent =
                new UserContinent();

            return continent.ReadAvailable();
        }

        [HttpGet("continents/{userId}")]
        public List<UserContinent> GetUserContinents(
            int userId)
        {
            UserContinent continent =
                new UserContinent();

            return continent.Read(userId);
        }

        [HttpPost("continent")]
        public int AddContinent(
            [FromBody] UserContinent continent)
        {
            return continent.Insert();
        }

        [HttpDelete("continent/{userId}/{continent}")]
        public bool DeleteContinent(
            int userId,
            string continent)
        {
            UserContinent userContinent =
                new UserContinent(
                    userId,
                    continent
                );

            return userContinent.Delete();
        }

        [HttpGet("available/languages")]
        public List<string> GetAvailableLanguages()
        {
            UserLanguage language =
                new UserLanguage();

            return language.ReadAvailable();
        }

        [HttpGet("languages/{userId}")]
        public List<UserLanguage> GetUserLanguages(
            int userId)
        {
            UserLanguage language =
                new UserLanguage();

            return language.Read(userId);
        }

        [HttpPost("language")]
        public int AddOrUpdateLanguage(
            [FromBody] UserLanguage language)
        {
            return language.InsertOrUpdate();
        }

        [HttpDelete("language/{userId}/{language}")]
        public bool DeleteLanguage(
            int userId,
            string language)
        {
            UserLanguage userLanguage =
                new UserLanguage(
                    userId,
                    language,
                    ""
                );

            return userLanguage.Delete();
        }

        [HttpGet("visited-count/{userId}")]
        public int GetVisitedCountriesCount(
            int userId)
        {
            User user = new User();
            user.Id = userId;

            return user.ReadVisitedCountriesCount();
        }
    }
}