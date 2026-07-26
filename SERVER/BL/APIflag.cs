namespace countryProj.BL
{
    public class APIflag
    {
        string svg;
        string png;
        public APIflag() { Svg = ""; Png = ""; }
        public APIflag(string svg, string png)  { Svg = svg;  Png = png;  }
        public string Svg{  get => svg;  set => svg = value; }
        public string Png{ get => png;  set => png = value; }
    }
}