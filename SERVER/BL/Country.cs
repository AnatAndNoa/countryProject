using countryProj.DAL;
using System.Text.Json;
namespace countryProj.BL
{
    public class Country
    {
        string code;
        string name;
        string capital;
        string region;
        double area;
        long population;
        List<string> languages;
        List<string> currency;
        string flag;

        public Country(string code, string name, string capital, string region, double area, long population, List<string> languages, List<string> currency, string flag)
        {
            Code = code;
            Name = name;
            Capital = capital;
            Region = region;
            Area = area;
            Population = population;
            Languages = languages;
            Currency = currency;
            Flag = flag;
        }
        public Country() { }

        public string Code { get => code; set => code = value; }
        public string Name { get => name; set => name = value; }
        public string Capital { get => capital; set => capital = value; }
        public string Region { get => region; set => region = value; }
        public double Area { get => area; set => area = value; }
        public long Population { get => population; set => population = value; }
        public List<string> Languages { get => languages; set => languages = value; }
        public List<string> Currency { get => currency; set => currency = value; }
        public string Flag { get => flag; set => flag = value; }


        public List<Country> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadCountries();
        }
        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertCountry(this);
        }
        public bool DeleteByCode(string code)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteCountry(code);
        }
        public bool UpdateCountry(string code)
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateCountry(this, code);
        }

        public static async Task<int> ImportCountriesFromAPI()
        {
            HttpClient client = new HttpClient();
            string api = "https://countries.dev/countries?fields=alpha2Code,name,capital,region,area,population,languages,currencies,flags";
            string json = await client.GetStringAsync(api);
            List<APIcountry> apiCountries =JsonSerializer.Deserialize<List<APIcountry>>(json, new JsonSerializerOptions {PropertyNameCaseInsensitive = true } );
            if (apiCountries == null)
                return 0;
            int counter = 0;
            foreach (APIcountry apiCountry in apiCountries)
            {
                Country country = apiCountry.ToCountry();
                int result = country.Insert();
                if (result > 0)
                    counter++;
            }
            return counter;
        }
    }
}
    