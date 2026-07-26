namespace countryProj.BL
{
    public class APIcurrency
    {
        string code;
        string name;
        string symbol;
        public APIcurrency()
        {
            Code = "";
            Name = "";
            Symbol = "";
        }
        public APIcurrency(string code, string name, string symbol)
        {
            Code = code;
            Name = name;
            Symbol = symbol;
        }

        public string Code{ get => code;set => code = value; }
        public string Name{ get => name; set => name = value; }
        public string Symbol { get => symbol; set => symbol = value; }
    }
}