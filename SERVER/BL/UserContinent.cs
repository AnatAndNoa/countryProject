using countryProj.DAL;

namespace countryProj.BL
{
    public class UserContinent
    {
        int userId;
        string continent;
        public UserContinent()
        {
            UserId = 0;
            Continent = "";
        }

        public UserContinent( int userId, string continent)
        {
            UserId = userId;
            Continent = continent;
        }

        public int UserId {  get { return userId; } set { userId = value; } }
        public string Continent { get { return continent; } set { continent = value; } }
        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertUserContinent(this);
        }

        public bool Delete()
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteUserContinent(  UserId, Continent);
        }

        public List<UserContinent> Read(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadUserContinents(userId);
        }

        public List<string> ReadAvailable()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadAvailableContinents();
        }
    }
}