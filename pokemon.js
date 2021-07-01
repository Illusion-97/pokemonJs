class Pokemon {
    constructor(num,nom,type,pvMax,atkBase,atkPuis) {
        this.num = num;
        this.nom = nom + " Lv.";
        this.type = type;
        this.pvMax = pvMax;
        this.atkBase = atkBase;
        this.atkPuis = atkPuis;
        this.attaque = function (pokemon) {
            let crit = 1;
            if (Math.random() <0.1){
                fightLog += "Coup critique !" + `<br>`;
                crit = 2;
            }
            if (pokemon.curPv / pokemon.pvMax > 0.2) {
                fightLog += (this.nom + " attaque avec " + this.atkBase.nom + " et infliges " + (this.atkBase.puiss*crit) + " de dommages à " + pokemon.nom)
                pokemon.curPv -= this.atkBase.puiss*crit;
            }else{
                fightLog += (this.nom + " attaque avec " + this.atkPuis.nom + " et infliges " + (this.atkPuis.puiss*crit) + " de dommages à " + pokemon.nom)
                pokemon.curPv -= this.atkPuis.puiss*crit;
            }
            fightLog += `<br>`;
            return pokemon;
        };
        this.setLevel = function (level){
            this.nom += level;
            this.pvMax *= (1 + (level/100))
            this.curPv = pvMax;
        };
    }
}

class Attaque {
    constructor(nom,puiss) {
        this.nom = nom;
        this.puiss = puiss;
    }
}

let eclair = new Attaque("Eclair",10);
let fatalFoudre = new Attaque("Fatal-Foudre",20);
let griffe = new Attaque("Griffe",9);
let charge = new Attaque("Charge",15);
let ruse = new Attaque("Ruse",12);
let eclaterox = new Attaque("Eclat'Roc",18);
let patience = new Attaque("Patience",8)
let jugement = new Attaque("Jugement",200);
let pikachu = new Pokemon(20,"Pikachu","Electrique",82,eclair,fatalFoudre);
let evoli = new Pokemon(133,"Evoli","Normal",75,griffe,charge);
let riolu = new Pokemon(447,"Riolu","Combat",78,ruse,eclaterox);
let arceus = new Pokemon(493,"Arceus","Normal",100,patience,jugement);
let pokemons = [pikachu,evoli,riolu,arceus];
let fightLog = "";

function fight(){
    let pokemon1 = getFighter();
    let pokemon2 = getFighter();
    while (pokemon1 == pokemon2)
    {
        pokemon2 = getFighter();
    }
    pokemon1.setLevel(getLevel());
    pokemon2.setLevel(getLevel());
    let pokemonKo = null,pokemonWinner = null;
    let first,second;
    if (Math.random() > 0.5){
        first = pokemon1;
        second = pokemon2
    } else {
        second = pokemon1;
        first = pokemon2
    }
    customElements.define('show-title', class extends HTMLElement {
        connectedCallback() {
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = `<p>` + first.nom.toUpperCase() + " VS " + second.nom.toUpperCase() +`</p>`;
        }
    });
    customElements.define('init-rand', class extends HTMLElement {
        connectedCallback() {
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = `<p>` + "Le sort a décidé que " + first.nom + " jouera en premier !" +`</p>`;
        }
    });
    while (pokemonKo == null){
        if(first.attaque(second).curPv <= 0){
            pokemonKo = second;
            pokemonWinner = first;
        }else{
            if(second.attaque(first).curPv <= 0) {
                pokemonKo = first;
                pokemonWinner = second;
            }
        }
    }
    customElements.define('show-winner', class extends HTMLElement {
        connectedCallback() {
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = `<p>` + pokemonWinner.nom + " a vaincu " + pokemonKo.nom + " avec " + pokemonWinner.curPv + " PV restant." +`</p>`;
        }
    });
    return fightLog;
}

function getFighter(){
    var pokemon = pokemons[Math.floor(Math.random()*pokemons.length)];
    return pokemon
}

function getLevel(){
    return (1 + (Math.floor(Math.random()*100)));
}

customElements.define('battle-zone', class extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `<p>` + fight(); +`</p>`;
    }
});
