using countryProj.DAL;

namespace countryProj.BL
{
    public class QuizScore
    {
        int userId;
        string quizType;
        int score;
        int highScore;
        bool isNewRecord;
        public QuizScore()
        {
            UserId = 0;
            QuizType = "";
            Score = 0;
            HighScore = 0;
            IsNewRecord = false;
        }

        public QuizScore(  int userId, string quizType, int score, int highScore, bool isNewRecord)
        {
            UserId = userId;
            QuizType = quizType;
            Score = score;
            HighScore = highScore;
            IsNewRecord = isNewRecord;
        }
        public int UserId { get { return userId; }    set { userId = value; }}
        public string QuizType{  get { return quizType; } set { quizType = value; } }
        public int Score{  get { return score; }   set { score = value; } }
        public int HighScore{   get { return highScore; }   set { highScore = value; }  }
        public bool IsNewRecord{  get { return isNewRecord; }   set { isNewRecord = value; } }
        public QuizScore Save()
        {
            DBservices dbs = new DBservices();
            return dbs.SaveQuizScore(this);
        }
        public QuizScore Read( int userId, string quizType)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadQuizScore(  userId,  quizType );
        }
        public List<QuizScore> ReadAll(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadAllQuizScores(userId);
        }
    }
}