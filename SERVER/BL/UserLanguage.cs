using countryProj.DAL;

namespace countryProj.BL
{
    public class UserLanguage
    {
        int userId;
        string language;
        string languageLevel;
        public UserLanguage()
        {
            UserId = 0;
            Language = "";
            LanguageLevel = "";
        }

        public UserLanguage( int userId, string language,  string languageLevel)
        {
            UserId = userId;
            Language = language;
            LanguageLevel = languageLevel;
        }
        public int UserId {  get { return userId; } set { userId = value; }  }
        public string Language   { get { return language; }  set { language = value; } }
        public string LanguageLevel  {  get { return languageLevel; }  set { languageLevel = value; } }
        public int InsertOrUpdate()  {
            DBservices dbs = new DBservices();
            return dbs.InsertOrUpdateUserLanguage(this);
        }

        public bool Delete()
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteUserLanguage( UserId, Language );
        }

        public List<UserLanguage> Read(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadUserLanguages(userId);
        }
        public List<string> ReadAvailable()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadAvailableLanguages();
        }
    }
}