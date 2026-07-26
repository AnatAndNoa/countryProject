using countryProj.DAL;

namespace countryProj.BL
{
    public class Friendship
    {
        int userId;
        int friendUserId;
        string friendUserName;
        string friendEmail;
        DateTime addedAt;
        public int UserId {  get => userId;   set => userId = value; }
        public int FriendUserId  {  get => friendUserId;  set => friendUserId = value; }
        public string FriendUserName { get => friendUserName; set => friendUserName = value; }
        public string FriendEmail {  get => friendEmail;  set => friendEmail = value; }
        public DateTime AddedAt { get => addedAt; set => addedAt = value; }
        public Friendship()
        {
            FriendUserName = "";
            FriendEmail = "";
        }

        public Friendship( int userId,  int friendUserId,  string friendUserName,  string friendEmail,  DateTime addedAt)
        {
            UserId = userId;
            FriendUserId = friendUserId;
            FriendUserName = friendUserName;
            FriendEmail = friendEmail;
            AddedAt = addedAt;
        }
        public int Add()
        {
            DBservices dbs =new DBservices();
            return dbs.AddFriend(this);
        }

        public List<Friendship> ReadFriends()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadFriends(UserId);
        }

        public List<UserCountry> ReadFriendVisitedCountries()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadFriendVisitedCountries( UserId, FriendUserId );
        }

        public List<CountryShare> ReadFriendCountryShares(string countryCode)
        {
            DBservices dbs =  new DBservices();
            return dbs.ReadFriendCountryShares(UserId, FriendUserId, countryCode );
        }
    }
}