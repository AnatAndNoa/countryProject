using countryProj.DAL;

namespace countryProj.BL
{
    public class UserLogin
    {
        int loginId;
        int userId;
        string userEmail;
        DateTime loginDate;

        public int LoginId{  get => loginId;  set => loginId = value; }
        public int UserId {  get => userId;  set => userId = value; }
        public string UserEmail {  get => userEmail;set => userEmail = value; }
        public DateTime LoginDate {   get => loginDate; set => loginDate = value; }

        public UserLogin()
        {
            UserEmail = "";
        }

        public List<UserLogin> ReadToday()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadTodayLogins();
        }
    }
}