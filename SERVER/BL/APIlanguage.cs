namespace countryProj.BL
{
    public class APIlanguage
    {
        string iso639_1;
        string iso639_2;
        string name;
        string nativeName;
        public APIlanguage()
        {
            Iso639_1 = "";
            Iso639_2 = "";
            Name = "";
            NativeName = "";
        }
        public APIlanguage(string iso639_1, string iso639_2,string name, string nativeName)
        {
            Iso639_1 = iso639_1;
            Iso639_2 = iso639_2;
            Name = name;
            NativeName = nativeName;
        }
        public string Iso639_1{ get => iso639_1; set => iso639_1 = value;}
        public string Iso639_2{get => iso639_2; set => iso639_2 = value; }
        public string Name {  get => name; set => name = value; }
        public string NativeName{  get => nativeName;  set => nativeName = value; }
    }
}