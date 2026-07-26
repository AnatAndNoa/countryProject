namespace countryProj.BL
{
    public class APIcountry
    {
        string alpha2Code;
        string name;
        string capital;
        string region;
        double? area;
        long? population;
        List<APIlanguage> languages;
        List<APIcurrency> currencies;
        APIflag flags;

        public string Alpha2Code { get => alpha2Code; set => alpha2Code = value; }
        public string Name { get => name; set => name = value; }
        public string Capital { get => capital; set => capital = value; }
        public string Region { get => region; set => region = value; }
        public double? Area { get => area; set => area = value; }
        public long? Population { get => population; set => population = value; }
        public List<APIlanguage> Languages { get => languages; set => languages = value; }
        public List<APIcurrency> Currencies { get => currencies; set => currencies = value; }
        public APIflag Flags { get => flags; set => flags = value; }

        public APIcountry()
        {
            Alpha2Code = "";
            Name = "";
            Capital = "";
            Region = "";
            Area = 0;
            Population = 0;
            Languages = new List<APIlanguage>();
            Currencies = new List<APIcurrency>();
            Flags = new APIflag();
        }

        public APIcountry( string alpha2Code,string name, string capital,  string region, double? area,   long? population,   List<APIlanguage> languages, List<APIcurrency> currencies, APIflag flags)
        {
            Alpha2Code = alpha2Code;
            Name = name;
            Capital = capital;
            Region = region;
            Area = area;
            Population = population;
            Languages = languages;
            Currencies = currencies;
            Flags = flags;
        }

        public Country ToCountry()
        {
            List<string> languageNames = new List<string>();
            if (Languages != null)
            {
                foreach (APIlanguage language in Languages)
                    languageNames.Add(language.Name);
            }

            List<string> currencyNames = new List<string>();
            if (Currencies != null)
            {
                foreach (APIcurrency currency in Currencies)
                    currencyNames.Add(currency.Name);
            }

            string flagUrl = "";
            if (Flags != null)
            {
                if (Flags.Png != "")
                    flagUrl = Flags.Png;
                else
                    flagUrl = Flags.Svg;
            }

            Country country = new Country(Alpha2Code, Name,  Capital, Region,  Area ?? 0,  Population ?? 0, languageNames, currencyNames,  flagUrl );
            return country;
        }
    }
}