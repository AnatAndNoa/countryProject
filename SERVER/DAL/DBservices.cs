using countryProj.BL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
namespace countryProj.DAL
{
    public class DBservices
    {
        public DBservices()
        {

        }
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString(conString);
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
        public int InsertUser(User user)//להכניס משתמש חדש לטבלת השמתמשים
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");
                
                Dictionary<string, object> paramDic =new Dictionary<string, object>();
               
                paramDic.Add( "@UserName",  user.UserName );
                paramDic.Add(  "@Email",  user.Email );
                paramDic.Add(  "@Password", user.Password );
                paramDic.Add(  "@BirthDate",  user.BirthDate );
                paramDic.Add( "@Address",user.Address);
                paramDic.Add( "@IsLocked", user.IsLocked );
                paramDic.Add("@Role",user.Role );
                paramDic.Add( "@IsShareBlocked", user.IsShareBlocked);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_INSERT_USER_AN", con, paramDic);

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<User> ReadUsers()//GET של כל המשתמשים
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<User> users = new List<User>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_ALL_USERS_AN", con, paramDic);

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    User user = new User();

                    user.Id = Convert.ToInt32( reader["Id"] );
                    user.UserName = Convert.ToString( reader["UserName"] );
                    user.Email = Convert.ToString( reader["Email"] );
                    user.Password = Convert.ToString( reader["Password"] );
                    user.BirthDate = Convert.ToString( reader["BirthDate"]);
                    user.Address = Convert.ToString( reader["Address"] );
                    user.IsLocked = Convert.ToBoolean( reader["IsLocked"] );
                    user.Role =Convert.ToString( reader["Role"] );
                    user.IsShareBlocked = Convert.ToBoolean( reader["IsShareBlocked"] );
                    users.Add(user);
                }

                reader.Close();

                return users;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public User LoginUser(string email, string password) //התחברות לפי אימייל וסיסימא
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;
            User user = null;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =new Dictionary<string, object>();

                paramDic.Add("@Email", email);
                paramDic.Add("@Password", password);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_LOGIN_USER_AN",con, paramDic );

                reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    user = new User();

                    user.Id = Convert.ToInt32( reader["Id"] );
                    user.UserName = Convert.ToString( reader["UserName"] );
                    user.Email = Convert.ToString( reader["Email"] );
                    user.Password = Convert.ToString( reader["Password"] );
                    user.BirthDate = Convert.ToString( reader["BirthDate"] );
                    user.Address =  Convert.ToString( reader["Address"] );
                    user.IsLocked = Convert.ToBoolean( reader["IsLocked"] );
                    user.Role = Convert.ToString( reader["Role"] );
                    user.IsShareBlocked = Convert.ToBoolean( reader["IsShareBlocked"] );
                }

                reader.Close();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }

            if (user != null)
            {
                InsertUserLogin(user.Id);
            }
            return user;
        }
        public bool DeleteUser(int id)//למחוק משתמש לפי תז
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");
                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add( "@Id", id);

                cmd = CreateCommandWithStoredProcedureGeneral("SP_DELETE_USER_AN", con, paramDic);

                int numAffected = cmd.ExecuteNonQuery();

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool UpdateUser( User user,int id)//לעדכן פרטים של מתמש לפי התז
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@Id", id);
                paramDic.Add(  "@UserName", user.UserName);
                paramDic.Add( "@Email",  user.Email);
                paramDic.Add("@Password", user.Password );
                paramDic.Add(  "@BirthDate",  user.BirthDate);
                paramDic.Add(  "@Address",  user.Address );
                paramDic.Add( "@IsLocked",   user.IsLocked );
                paramDic.Add( "@Role",   user.Role );
                paramDic.Add(   "@IsShareBlocked", user.IsShareBlocked );

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_UPDATE_USER_AN", con,  paramDic);

                int numAffected = cmd.ExecuteNonQuery();

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<Country> ReadCountries()//GET של כל המדינות מהטבלה ביחד עם השפות והמטבעות והדגל
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<Country> countriesList = new List<Country>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =  new Dictionary<string, object>();

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_ALL_COUNTRIES_AN",  con, paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Country country = new Country();

                    country.Code = Convert.ToString(reader["Code"]);
                    country.Name = Convert.ToString(reader["Name"]);
                    country.Capital = Convert.ToString(reader["Capital"]);
                    country.Region = Convert.ToString(reader["Region"]);

                    if (reader["Area"] == DBNull.Value)
                        country.Area = 0;
                    else
                        country.Area = Convert.ToDouble(reader["Area"]);

                    if (reader["Population"] == DBNull.Value)
                        country.Population = 0;
                    else
                        country.Population = Convert.ToInt64(reader["Population"]);

                    country.Flag = Convert.ToString(reader["Flag"]);

                    countriesList.Add(country);
                }

                reader.Close();

                foreach (Country country in countriesList)
                {
                    country.Languages = ReadCountryLanguages(country.Code);
                    country.Currency = ReadCountryCurrencies(country.Code);
                }

                return countriesList;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<string> ReadCountryLanguages(string countryCode)//GET של השפות בשביל מדינה
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<string> languages = new List<string>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@CountryCode", countryCode);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_COUNTRY_LANGUAGES_AN",    con, paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                    languages.Add(Convert.ToString(reader["Language"]) );

                reader.Close();

                return languages;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<string> ReadCountryCurrencies(string countryCode)//GET של המטבעות בשביל מדינה
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<string> currencies = new List<string>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@CountryCode", countryCode);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_COUNTRY_CURRENCIES_AN",  con, paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    currencies.Add( Convert.ToString(reader["Currency"]) );
                }

                reader.Close();

                return currencies;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertCountry(Country country)//הוספת מדינה חדשה
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@Code", country.Code);
                paramDic.Add("@Name", country.Name);
                paramDic.Add("@Capital", country.Capital);
                paramDic.Add("@Region", country.Region);
                paramDic.Add("@Area", country.Area);
                paramDic.Add("@Population", country.Population);
                paramDic.Add("@Flag", country.Flag);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_INSERT_COUNTRY_AN",   con,paramDic );

                int numAffected = cmd.ExecuteNonQuery();

                if (country.Languages != null)
                {
                    foreach (string language in country.Languages)
                    {
                        InsertCountryLanguage(country.Code, language);
                    }
                }

                if (country.Currency != null)
                {
                    foreach (string currency in country.Currency)
                    {
                        InsertCountryCurrency(country.Code, currency);
                    }
                }

                return numAffected;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertCountryLanguage(string countryCode, string language)//הוספה של השפות של המדינה לטבלת השפות
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =new Dictionary<string, object>();

                paramDic.Add("@CountryCode", countryCode);
                paramDic.Add("@Language", language);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_INSERT_COUNTRY_LANGUAGE_AN", con, paramDic );

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertCountryCurrency(string countryCode, string currency)//הוספה של המטבעות של מדינה לטבלת המטבעות
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@CountryCode", countryCode);
                paramDic.Add("@Currency", currency);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_INSERT_COUNTRY_CURRENCY_AN",  con, paramDic );

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool DeleteCountry(string code)//מחיקה של מדינה
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =new Dictionary<string, object>();

                paramDic.Add("@Code", code);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_DELETE_COUNTRY_AN", con, paramDic);

                int numAffected = cmd.ExecuteNonQuery();

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool UpdateCountry(Country country, string code)//עדכון פרטי מדינה לפי התז שלה
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =new Dictionary<string, object>();

                paramDic.Add("@Code", code);
                paramDic.Add("@Name", country.Name);
                paramDic.Add("@Capital", country.Capital);
                paramDic.Add("@Region", country.Region);
                paramDic.Add("@Area", country.Area);
                paramDic.Add("@Population", country.Population);
                paramDic.Add("@Flag", country.Flag);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_UPDATE_COUNTRY_AN", con, paramDic);

                int numAffected = cmd.ExecuteNonQuery();

                DeleteCountryLanguages(code);
                DeleteCountryCurrencies(code);

                if (country.Languages != null)
                {
                    foreach (string language in country.Languages)
                    {
                        InsertCountryLanguage(code, language);
                    }
                }

                if (country.Currency != null)
                {
                    foreach (string currency in country.Currency)
                    {
                        InsertCountryCurrency(code, currency);
                    }
                }

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int DeleteCountryLanguages(string countryCode)//מחיקה של ש]ות של מדינה שנמחקה
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@CountryCode", countryCode);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_DELETE_COUNTRY_LANGUAGES_AN", con, paramDic );

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int DeleteCountryCurrencies(string countryCode)//מחיקה של מטבעות של מדינה שנמחקה
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@CountryCode", countryCode);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_DELETE_COUNTRY_CURRENCIES_AN",  con, paramDic );

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertUserCountry(UserCountry userCountry)//להכניס למשתמש ספציפי מדינה לרשימה של מדינות שהוא ביקר או רוצה לבקר
        {
            SqlConnection con = connect("myProjDB");

            SqlCommand cmd = new SqlCommand( "AddUserCountry_AN", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue( "@UserId",  userCountry.UserId );

            cmd.Parameters.AddWithValue( "@CountryCode", userCountry.CountryCode );

            cmd.Parameters.AddWithValue( "@ListType", userCountry.ListType );

            int numAffected = cmd.ExecuteNonQuery();

            con.Close();

            return numAffected;
        }
        public bool DeleteUserCountry(int userId, string countryCode)//למחוק למשתמש ספציפי מתוך אחת הרשימות מדינה
        {
            SqlConnection con = connect("myProjDB");

            SqlCommand cmd = new SqlCommand( "DeleteUserCountry_AN",  con  );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue( "@UserId", userId);

            cmd.Parameters.AddWithValue( "@CountryCode", countryCode );

            int numAffected = cmd.ExecuteNonQuery();

            con.Close();

            return numAffected > 0;
        }
        public List<UserCountry> ReadVisitedCountries(int userId)//GET עבור משתמש ספציפי את המדינות שהוא ביקר
        {
            SqlConnection con = connect("myProjDB");

            SqlCommand cmd = new SqlCommand("GetVisitedCountries_AN",  con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue( "@UserId", userId );

            SqlDataReader reader = cmd.ExecuteReader();

            List<UserCountry> userCountries =new List<UserCountry>();

            while (reader.Read())
            {
                UserCountry userCountry = new UserCountry();
                userCountry.UserId = Convert.ToInt32(reader["UserId"]);
                userCountry.CountryCode = reader["CountryCode"].ToString();
                userCountry.CountryName = reader["CountryName"].ToString();
                userCountry.Flag = reader["Flag"].ToString();
                userCountry.ListType =reader["ListType"].ToString();
                userCountries.Add(userCountry);
            }

            reader.Close();
            con.Close();

            return userCountries;
        }
        public List<UserCountry> ReadWantToVisitCountries(int userId)//GET עבור משתמש ספציפי את המידנות שהוא רוצה לבקר 
        {
            SqlConnection con = connect("myProjDB");

            SqlCommand cmd = new SqlCommand("GetWantToVisitCountries_AN",con );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue( "@UserId", userId );

            SqlDataReader reader = cmd.ExecuteReader();

            List<UserCountry> userCountries = new List<UserCountry>();

            while (reader.Read())
            {
                UserCountry userCountry = new UserCountry();
                userCountry.UserId = Convert.ToInt32(reader["UserId"]);
                userCountry.CountryCode =  reader["CountryCode"].ToString();
                userCountry.CountryName = reader["CountryName"].ToString();
                userCountry.Flag = reader["Flag"].ToString();
                userCountry.ListType =reader["ListType"].ToString();
                userCountries.Add(userCountry);
            }

            reader.Close();
            con.Close();

            return userCountries;
        }
        public QuizScore SaveQuizScore(QuizScore quizScore)//לשמור למשתמש את השיא|לעדכן למשתמש את השיא
        {
            SqlConnection con = connect("myProjDB");
            SqlCommand cmd = new SqlCommand("SaveQuizScore_AN", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue( "@UserId", quizScore.UserId );

            cmd.Parameters.AddWithValue( "@QuizType", quizScore.QuizType );

            cmd.Parameters.AddWithValue("@Score",  quizScore.Score);

            SqlDataReader reader = cmd.ExecuteReader();

            QuizScore result = new QuizScore();

            if (reader.Read())
            {
                result.UserId =Convert.ToInt32(reader["UserId"]);
                result.QuizType = reader["QuizType"].ToString();
                result.Score = Convert.ToInt32(reader["Score"]);
                result.HighScore =  Convert.ToInt32(reader["HighScore"]);
                result.IsNewRecord =  Convert.ToBoolean(reader["IsNewRecord"]);
            }

            reader.Close();
            con.Close();

            return result;
        }
        public QuizScore ReadQuizScore( int userId, string quizType)//להציג למשתמש את השיא בחידון מסיוים
        {
            SqlConnection con = connect("myProjDB");

            SqlCommand cmd = new SqlCommand( "GetQuizScore_AN", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue( "@UserId", userId);

            cmd.Parameters.AddWithValue("@QuizType", quizType );

            SqlDataReader reader = cmd.ExecuteReader();

            QuizScore quizScore = new QuizScore();

            if (reader.Read())
            {
                quizScore.UserId = Convert.ToInt32(reader["UserId"]);
                quizScore.QuizType =  reader["QuizType"].ToString();
                quizScore.Score = Convert.ToInt32(reader["Score"]);
                quizScore.HighScore = Convert.ToInt32(reader["HighScore"]);
                quizScore.IsNewRecord = Convert.ToBoolean(reader["IsNewRecord"]);
            }

            reader.Close();
            con.Close();

            return quizScore;
        }
        public List<QuizScore> ReadAllQuizScores(int userId)//GET של השיאים של משתמש מסויים בשני החידונים
        {
            SqlConnection con = connect("myProjDB");

            SqlCommand cmd = new SqlCommand("GetAllQuizScores_AN", con );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue( "@UserId",userId);

            SqlDataReader reader = cmd.ExecuteReader();

            List<QuizScore> quizScores = new List<QuizScore>();

            while (reader.Read())
            {
                QuizScore quizScore = new QuizScore();
                quizScore.UserId =  Convert.ToInt32(reader["UserId"]);
                quizScore.QuizType =  reader["QuizType"].ToString();
                quizScore.Score =  Convert.ToInt32(reader["Score"]);
                quizScore.HighScore =Convert.ToInt32(reader["HighScore"]);
                quizScore.IsNewRecord =Convert.ToBoolean(reader["IsNewRecord"]);
                quizScores.Add(quizScore);
            }

            reader.Close();
            con.Close();

            return quizScores;
        }
        public List<string> ReadAvailableContinents()//להציג את כל היבשות שיש - מתוך הטבלה של המידנות
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<string> continents = new List<string>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_AVAILABLE_CONTINENTS_AN",  con, paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    continents.Add(  Convert.ToString(reader["Continent"]) );
                }

                reader.Close();

                return continents;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertUserContinent( UserContinent userContinent)//לוהסיף למשתמש ספציפי יבשת לרשימה של היבשות המועדפות עליו
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add( "@UserId", userContinent.UserId);
                paramDic.Add( "@Continent", userContinent.Continent );

                cmd = CreateCommandWithStoredProcedureGeneral(  "SP_ADD_USER_CONTINENT_AN", con, paramDic );

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool DeleteUserContinent( int userId,string continent)//למחוק למשתמש ספציפי יבשת מתו ךהרשימה שלו
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@UserId", userId);
                paramDic.Add("@Continent", continent);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_DELETE_USER_CONTINENT_AN",  con, paramDic );

                int numAffected = cmd.ExecuteNonQuery();

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<UserContinent> ReadUserContinents(int userId)//GET למשתמש ספציפי את היבשות המועדפעות עליו
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<UserContinent> continents =new List<UserContinent>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@UserId", userId);

                cmd = CreateCommandWithStoredProcedureGeneral("SP_GET_USER_CONTINENTS_AN",  con, paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    UserContinent continent = new UserContinent();
                    continent.UserId = Convert.ToInt32(reader["UserId"]);
                    continent.Continent = Convert.ToString(reader["Continent"]);
                    continents.Add(continent);
                }

                reader.Close();

                return continents;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<string> ReadAvailableLanguages()//GET של כל השפות שיש בשביל להציג ברשימה הנפתחת
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<string> languages =new List<string>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_AVAILABLE_LANGUAGES_AN", con, paramDic);

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    languages.Add( Convert.ToString(reader["Language"]) );
                }

                reader.Close();

                return languages;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertOrUpdateUserLanguage( UserLanguage userLanguage)//להוסיף שפה למשתמש וגם לעדככן רמות שליטה
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add( "@UserId",userLanguage.UserId );
                paramDic.Add( "@Language", userLanguage.Language );
                paramDic.Add( "@LanguageLevel",userLanguage.LanguageLevel);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_ADD_OR_UPDATE_USER_LANGUAGE_AN", con, paramDic);

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool DeleteUserLanguage( int userId,string language)//למחוק מרשימת שפות של השמתמש שפה כלשהי
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =new Dictionary<string, object>();

                paramDic.Add("@UserId", userId);
                paramDic.Add("@Language", language);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_DELETE_USER_LANGUAGE_AN", con, paramDic );

                int numAffected = cmd.ExecuteNonQuery();

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<UserLanguage> ReadUserLanguages(int userId)//GET של שפות של מתמש ספציפי
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<UserLanguage> languages = new List<UserLanguage>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@UserId", userId);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_USER_LANGUAGES_AN", con,paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    UserLanguage language = new UserLanguage();
                    language.UserId =Convert.ToInt32(reader["UserId"]);
                    language.Language = Convert.ToString(reader["Language"]);
                    language.LanguageLevel = Convert.ToString( reader["LanguageLevel"] );
                    languages.Add(language);
                }

                reader.Close();

                return languages;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int ReadVisitedCountriesCount(int userId)//ספירה כמה מידנות יש ברשימה של כבר ביקרתי
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =new Dictionary<string, object>();

                paramDic.Add("@UserId", userId);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_VISITED_COUNTRIES_COUNT_AN", con,paramDic );

                reader = cmd.ExecuteReader();

                int count = 0;

                if (reader.Read())
                {
                    count = Convert.ToInt32( reader["VisitedCountriesCount"] );
                }

                reader.Close();

                return count;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertCountryShare( CountryShare countryShare)//הוספת שיתוף למדינה מסויימת
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add("@UserId",countryShare.UserId );
                paramDic.Add("@CountryCode", countryShare.CountryCode);
                paramDic.Add( "@Content",  countryShare.Content );

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_INSERT_COUNTRY_SHARE_AN", con, paramDic);

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<CountryShare> ReadSharesByCountry( string countryCode)//GET שיתופים למדינה מסויימת
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<CountryShare> shares = new List<CountryShare>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =new Dictionary<string, object>();

                paramDic.Add("@CountryCode",countryCode);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_SHARES_BY_COUNTRY_AN", con, paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    CountryShare share = new CountryShare();
                    share.ShareId = Convert.ToInt32( reader["ShareId"]);
                    share.UserId = Convert.ToInt32( reader["UserId"] );
                    share.UserName =  Convert.ToString(  reader["UserName"]);
                    share.CountryCode =   Convert.ToString( reader["CountryCode"] );
                    share.CountryName = Convert.ToString(reader["CountryName"] );
                    share.Content = Convert.ToString(   reader["Content"] );
                    share.CreatedAt = Convert.ToDateTime(    reader["CreatedAt"]    );
                    shares.Add(share);
                }

                reader.Close();

                return shares;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<CountryShare> ReadSharesByUser( int userId)//GET שיתפוים של משתמש מסויים
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<CountryShare> shares = new List<CountryShare>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =  new Dictionary<string, object>();

                paramDic.Add( "@UserId",  userId );

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_SHARES_BY_USER_AN",  con, paramDic  );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    CountryShare share = new CountryShare();
                    share.ShareId = Convert.ToInt32( reader["ShareId"] );
                    share.UserId =  Convert.ToInt32(     reader["UserId"]  );
                    share.UserName =  Convert.ToString( reader["UserName"] );
                    share.CountryCode = Convert.ToString(   reader["CountryCode"] );
                    share.CountryName = Convert.ToString(  reader["CountryName"]  );
                    share.Content =  Convert.ToString(  reader["Content"]  );
                    share.CreatedAt =  Convert.ToDateTime( reader["CreatedAt"] );
                    shares.Add(share);
                }

                reader.Close();

                return shares;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool UpdateCountryShare(  CountryShare countryShare, int shareId, int userId)//עדכון של שיתוף
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add(  "@ShareId", shareId );
                paramDic.Add(  "@UserId",   userId  );
                paramDic.Add(  "@Content",    countryShare.Content );

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_UPDATE_COUNTRY_SHARE_AN", con,   paramDic );

                int numAffected =  cmd.ExecuteNonQuery();

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool DeleteCountryShare( int shareId, int userId)//מחיקה לש שיתוף
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                paramDic.Add( "@ShareId",  shareId );
                paramDic.Add(  "@UserId",   userId  );

                cmd = CreateCommandWithStoredProcedureGeneral(  "SP_DELETE_COUNTRY_SHARE_AN",  con,   paramDic  );

                int numAffected =  cmd.ExecuteNonQuery();

                return numAffected > 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertUserLogin(int userId)//הוספת כניסה של משתמש לטבלת הכניסות
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();
                paramDic.Add( "@UserId", userId );

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_INSERT_USER_LOGIN_AN",  con,  paramDic);

                return cmd.ExecuteNonQuery();
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<UserLogin> ReadTodayLogins()//GET של הכניסות היום
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<UserLogin> logins = new List<UserLogin>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_TODAY_LOGINS_AN",   con, paramDic  );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    UserLogin login =   new UserLogin();

                    login.LoginId = Convert.ToInt32(  reader["LoginId"] );
                    login.UserId =  Convert.ToInt32( reader["UserId"] );
                    login.UserEmail = Convert.ToString( reader["UserEmail"]  );
                    login.LoginDate = Convert.ToDateTime( reader["LoginDate"]  );
                    logins.Add(login);
                }

                reader.Close();

                return logins;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<CountryShare> ReadTodayShares()//GET של כל השיתוים היום
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<CountryShare> shares = new List<CountryShare>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =  new Dictionary<string, object>();

                cmd =   CreateCommandWithStoredProcedureGeneral(   "SP_GET_TODAY_SHARES_AN", con,  paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    CountryShare share =  new CountryShare();
                    share.ShareId = Convert.ToInt32(  reader["ShareId"] );
                    share.UserId =   Convert.ToInt32( reader["UserId"]  );
                    share.UserName =  Convert.ToString(  reader["UserName"]  );
                    share.UserEmail =  Convert.ToString(   reader["UserEmail"] );
                    share.CountryCode = Convert.ToString(   reader["CountryCode"]  );
                    share.CountryName =   Convert.ToString( reader["CountryName"] );
                    share.Flag =   Convert.ToString(   reader["Flag"] );
                    share.Content =  Convert.ToString(     reader["Content"]   );
                    share.CreatedAt =   Convert.ToDateTime(  reader["CreatedAt"] );
                    shares.Add(share);
                }

                reader.Close();

                return shares;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<UserCountry> ReadTodaySavedCountries()//GET של כל המדינות שנשמרו ברשימות ביקור היו
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<UserCountry> countries = new List<UserCountry>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                cmd = CreateCommandWithStoredProcedureGeneral(  "SP_GET_TODAY_SAVED_COUNTRIES_AN", con, paramDic  );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    UserCountry country =  new UserCountry();
                    country.UserId = Convert.ToInt32(  reader["UserId"]  );
                    country.UserEmail =  Convert.ToString(   reader["UserEmail"]  );
                    country.CountryCode = Convert.ToString( reader["CountryCode"] );
                    country.CountryName =   Convert.ToString(       reader["CountryName"]);
                    country.Flag = Convert.ToString(  reader["Flag"] );
                    country.ListType =  Convert.ToString(  reader["ListType"] );
                    countries.Add(country);
                }

                reader.Close();

                return countries;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<Country> ReadTodayImportedCountries()//GET של כל המיסנות שעשינו להם היום IMPROT
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<Country> countries = new List<Country>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_TODAY_IMPORTED_COUNTRIES_AN",  con, paramDic  );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Country country =  new Country();
                    country.Code =  Convert.ToString(  reader["Code"]   );
                    country.Name =   Convert.ToString(   reader["Name"] );
                    country.Capital =  Convert.ToString(  reader["Capital"]  );
                    country.Region =  Convert.ToString(    reader["Region"] );

                    if (reader["Area"] == DBNull.Value)
                    {
                        country.Area = 0;
                    }
                    else
                    {
                        country.Area = Convert.ToDouble(  reader["Area"]);
                    }

                    if (
                        reader["Population"]  == DBNull.Value )
                    {
                        country.Population = 0;
                    }
                    else
                    {
                        country.Population = Convert.ToInt64(  reader["Population"] );
                    }

                    country.Flag = Convert.ToString( reader["Flag"] );

                    countries.Add(country);
                }

                reader.Close();

                foreach (Country country in countries)
                {
                    country.Languages =   ReadCountryLanguages(  country.Code );
                    country.Currency = ReadCountryCurrencies(  country.Code  );
                }

                return countries;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int AddFriend( Friendship friendship)//הסופת חבר 
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =  new Dictionary<string, object>();
                paramDic.Add( "@UserId",  friendship.UserId  );
                paramDic.Add(  "@FriendEmail",friendship.FriendEmail );

                cmd =  CreateCommandWithStoredProcedureGeneral( "SP_ADD_FRIEND_AN", con, paramDic );

                object result = cmd.ExecuteScalar();

                if ( result == null || result == DBNull.Value )
                {
                    return 0;
                }

                return Convert.ToInt32(result);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<Friendship> ReadFriends( int userId)//GET חברים של משתמש מסוים
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<Friendship> friends = new List<Friendship>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic =  new Dictionary<string, object>();

                paramDic.Add( "@UserId", userId);

                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_USER_FRIENDS_AN",  con,paramDic);

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Friendship friendship = new Friendship();
                    friendship.UserId = Convert.ToInt32( reader["UserId"] );
                    friendship.FriendUserId =  Convert.ToInt32(  reader["FriendUserId"] );
                    friendship.FriendUserName =  Convert.ToString(  reader["FriendUserName"] );
                    friendship.FriendEmail =  Convert.ToString(  reader["FriendEmail"]  );
                    friendship.AddedAt = Convert.ToDateTime(  reader["AddedAt"] );
                    friends.Add(friendship);
                }

                reader.Close();

                return friends;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<UserCountry> ReadFriendVisitedCountries( int viewerUserId, int friendUserId)//להציג לחבר מסוים של מתמש את המידנותל שהוא ביקר
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<UserCountry> countries =new List<UserCountry>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();
                paramDic.Add( "@ViewerUserId", viewerUserId );
                paramDic.Add( "@FriendUserId", friendUserId );
                cmd = CreateCommandWithStoredProcedureGeneral(  "SP_GET_FRIEND_VISITED_COUNTRIES_AN", con, paramDic );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    UserCountry country = new UserCountry();
                    country.UserId = Convert.ToInt32(   reader["UserId"] );
                    country.CountryCode =   Convert.ToString(  reader["CountryCode"]  );
                    country.CountryName =  Convert.ToString( reader["CountryName"] );
                    country.Flag =  Convert.ToString(    reader["Flag"]  );
                    country.ListType =  Convert.ToString( reader["ListType"]  );
                    country.HasShares =  Convert.ToBoolean(  reader["HasShares"] );
                    countries.Add(country);
                }

                reader.Close();

                return countries;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<CountryShare>ReadFriendCountryShares(int viewerUserId, int friendUserId,string countryCode)//לקרוא שיתפוים של חבר מסוים על מסינה מסוימת
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            List<CountryShare> shares = new List<CountryShare>();

            try
            {
                con = connect("myProjDB");

                Dictionary<string, object> paramDic = new Dictionary<string, object>();
                paramDic.Add(  "@ViewerUserId", viewerUserId );
                paramDic.Add(  "@FriendUserId",  friendUserId  );
                paramDic.Add(  "@CountryCode",  countryCode );
                
                cmd = CreateCommandWithStoredProcedureGeneral( "SP_GET_FRIEND_COUNTRY_SHARES_AN",  con, paramDic  );

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    CountryShare share =  new CountryShare();
                    share.ShareId = Convert.ToInt32( reader["ShareId"] );
                    share.UserId =   Convert.ToInt32(    reader["UserId"] );
                    share.UserName =  Convert.ToString(    reader["UserName"]  );
                    share.UserEmail =  Convert.ToString(   reader["UserEmail"]  );
                    share.CountryCode =   Convert.ToString(   reader["CountryCode"]    );
                    share.CountryName = Convert.ToString(  reader["CountryName"]   );
                    share.Flag = Convert.ToString( reader["Flag"]   );
                    share.Content =    Convert.ToString(   reader["Content"]  );
                    share.CreatedAt =   Convert.ToDateTime(     reader["CreatedAt"]   );
                    shares.Add(share);
                }

                reader.Close();

                return shares;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        private SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, SqlConnection con, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }

            return cmd;
        }
    }
}
