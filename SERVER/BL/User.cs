using countryProj.DAL;


namespace countryProj.BL
{
    public class User
    {
        int id;
        string userName;
        string email;
        string password;
        string birthDate;
        string address;
        bool isLocked;
        string role;
        bool isShareBlocked;

        public int Id { get => id; set => id = value; }
        public string UserName { get => userName; set => userName = value; }
        public string Email { get => email; set => email = value; }
        public string Password { get => password; set => password = value; }
        public string BirthDate { get => birthDate; set => birthDate = value; }
        public string Address { get => address; set => address = value; }
        public bool IsLocked { get => isLocked; set => isLocked = value; }
        public string Role { get => role; set => role = value; }
        public bool IsShareBlocked  { get { return isShareBlocked; } set { isShareBlocked = value; } }

        public User()
        {
            UserName = "";
            Email = "";
            Password = "";
            BirthDate = "";
            Address = "";
            IsLocked = false;
            Role = "User";
            IsShareBlocked = false;
        }
        public User(int id, string userName, string email, string password, string birthDate, string address, bool isLocked, string role, bool isShareBlocked)
        {
            Id = id;
            UserName = userName;
            Email = email;
            Password = password;
            BirthDate = birthDate;
            Address = address;
            IsLocked = isLocked;
            Role = role;
            IsShareBlocked = isShareBlocked;
        }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertUser(this);
        }
        public List<User> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadUsers();
        }
        public User Login()
        {
            DBservices dbs = new DBservices();
            return dbs.LoginUser(Email, Password);
        }
        public bool DeleteById(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteUser(id);
        }
        public bool UpdateUser(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateUser(this, id);
        }
        public int ReadVisitedCountriesCount()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadVisitedCountriesCount(Id);
        }
    }
}