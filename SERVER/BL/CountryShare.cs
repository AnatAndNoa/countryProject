using countryProj.DAL;

namespace countryProj.BL
{
    public class CountryShare
    {
        int shareId;
        int userId;
        string userName;
        string countryCode;
        string countryName;
        string content;
        DateTime createdAt;
        string userEmail;
        string flag;

        public CountryShare()
        {
            ShareId = 0;
            UserId = 0;
            UserName = "";
            CountryCode = "";
            CountryName = "";
            Content = "";
            CreatedAt = DateTime.Now;
            UserEmail = "";
            Flag = "";
        }

        public CountryShare( int shareId, int userId, string userName, string countryCode,  string countryName, string content, DateTime createdAt)
        {
            ShareId = shareId;
            UserId = userId;
            UserName = userName;
            CountryCode = countryCode;
            CountryName = countryName;
            Content = content;
            CreatedAt = createdAt;
        }
        public int ShareId {   get { return shareId; }    set { shareId = value; } }
        public int UserId {   get { return userId; }  set { userId = value; }}
        public string UserName {  get { return userName; }   set { userName = value; } }
        public string CountryCode  {get { return countryCode; }    set { countryCode = value; }}
        public string CountryName {  get { return countryName; }  set { countryName = value; } }
        public string Content  {  get { return content; }   set { content = value; }  }
        public DateTime CreatedAt { get { return createdAt; }  set { createdAt = value; } }
        public string UserEmail {   get => userEmail;    set => userEmail = value;  }
        public string Flag  {   get => flag;   set => flag = value; }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertCountryShare(this);
        }

        public List<CountryShare> ReadByCountry( string countryCode)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadSharesByCountry( countryCode );
        }
        public List<CountryShare> ReadByUser(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadSharesByUser(   userId );
        }
        public bool Update(  int shareId,  int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateCountryShare( this ,shareId,userId );
        }

        public bool Delete(  int shareId,  int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteCountryShare(shareId,  userId );
        }
    }
}