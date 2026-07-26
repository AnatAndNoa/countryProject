using countryProj.DAL;

namespace countryProj.BL
{
    public class UserCountry
    {
        int userId;
        string countryCode;
        string countryName;
        string flag;
        string listType;
        string userEmail;
        bool hasShares;
        public UserCountry()
        {
            UserId = 0;
            CountryCode = "";
            CountryName = "";
            Flag = "";
            ListType = "";
            UserEmail = "";

        }

        public UserCountry( int userId, string countryCode, string countryName, string flag, string listType)
        {
            UserId = userId;
            CountryCode = countryCode;
            CountryName = countryName;
            Flag = flag;
            ListType = listType;
        }
        public int UserId { get { return userId; } set { userId = value; }}
        public string CountryCode{  get { return countryCode; } set { countryCode = value; }}
        public string CountryName {   get { return countryName; }   set { countryName = value; } }
        public string Flag {  get { return flag; }  set { flag = value; }  }
        public string ListType {  get { return listType; } set { listType = value; } }
        public string UserEmail {   get => userEmail;   set => userEmail = value;  }
        public bool HasShares {   get => hasShares;   set => hasShares = value;  }
        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertUserCountry(this);
        }

        public bool Delete()
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteUserCountry(UserId, CountryCode);
        }
        public List<UserCountry> ReadVisited(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadVisitedCountries(userId);
        }
        public List<UserCountry> ReadWantToVisit(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadWantToVisitCountries(userId);
        }
    }
}