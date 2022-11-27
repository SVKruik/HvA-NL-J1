public class Leeuw {
    private String naam;
    private boolean heeftGroteManen;

    private int brullen;

    private boolean luieren;

    public int brullen(int aantalKeer){
        aantalKeer = 0;
        return aantalKeer;
    }

    public boolean luieren(boolean luieren) {
        return luieren;
    }

    public String getNaam(){
        return this.naam;
    }



    public boolean getHeeftGroteManen(){
        return this.heeftGroteManen;
    }

    public int getBrullen(){
        return this.brullen;
    }

    public boolean getLuieren(){
        return this.luieren;
    }



    Leeuw(String naam, Boolean heeftGroteManen, int brullen, boolean luieren) {
        this.naam = naam;
        this.heeftGroteManen = heeftGroteManen;
        this.brullen = brullen;
        this.luieren = luieren;
    }
}
