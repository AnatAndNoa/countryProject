using countryProj.BL;
using Microsoft.AspNetCore.Mvc;

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizScoresController : ControllerBase
    {
        [HttpPost]
        public QuizScore Post(
            [FromBody] QuizScore quizScore)
        {
            return quizScore.Save();
        }

        [HttpGet("{userId}/{quizType}")]
        public QuizScore Get(
            int userId,
            string quizType)
        {
            QuizScore quizScore =
                new QuizScore();

            return quizScore.Read(
                userId,
                quizType
            );
        }

        [HttpGet("user/{userId}")]
        public List<QuizScore> GetAll(int userId)
        {
            QuizScore quizScore =
                new QuizScore();

            return quizScore.ReadAll(userId);
        }
    }
}