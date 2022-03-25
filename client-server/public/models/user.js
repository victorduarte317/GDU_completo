// manipulaçao de dados

class User {

    constructor (name, gender, birth, country, email, password, photo, admin){ 

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
        //propriedades privadas, encapsuladas
    }

    // get cria métodos pra retornar o valor das variáveis privadas
    // é importante ter métodos get que retornam propriedades por questão de segurança
    // é possível adicionar códigos de condições que serão executados pra controlar o acesso dessas variáveis


    // por exemplo, se alguém digitar no console "console.log(objeto.name)"
    // ao invés do objeto ser mostrado diretamente, o javaScript vai chamar o método get nome() e analisar as restrições e regras contidas no código dele antes de exibí-lo.
    
    // supondo também, que as informações do valor do lado e da altura de um cubo estão armazenadas
    // pra saber a area desse cubo, é possível ter um get que calcule lado * altura e retorne isso quando o objeto area() for chamado
    
    get id() {
        return this._id;
    }

    get register() {
        return this._register;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    set photo(value) { // O parâmetro aqui é correspondente ao valor que você quer manipular
        this._photo = value; // Aqui, toda vez que o método photo for chamado e receber um valor, esse método vai ser executado

    }

    loadFromJSON(json) {

        for (let name in json) { // pra cada nome encontrado em json faça

            switch(name) {
                case "_register":
                    this[name] = new Date(json[name]);
                break;

                default: 
                    if (name.substring(0, 1) === "_") this[name] = json[name];
            }
            

        }

    }

    static getUsersStorage() { // como nao usa this e so retorna, pode ser static

        return HttpRequest.get('/users'); // retorna a promessa

    }

    // método pra converter do objeto instanciado pra JSON
    toJSON() {

        let json = {};

        Object.keys(this).forEach(key => { // Object.keys vai ler os atributos do objeto dentro de () e retornar um array

        if (this[key] !== undefined) json[key] = this[key];

        });

        return json;


    }

    saveUser() {

        return new Promise((resolve, reject)=> {

            
        let promise;

        // como os blocos vão retornar um promise, é possivel criar uma variavel pra armazenar esse promise e tratar ele depois
            if(this.id) {

                promise = HttpRequest.put(`/users/${this.id}`, this.toJSON());

            } else {

                promise = HttpRequest.post(`/users/${this.id}`, this.toJSON());
            } 

            promise.then(data=>{

                this.loadFromJSON(data); // carrega e atualiza as informaçoes

                resolve(this); // retorna esse objeto instanciado

            }).catch(e=>{ // caso nao dê certo

                reject(e); // retorna reject e passa o erro
            })

        });

    }

    remove() {

        return HttpRequest.delete(`/users/${this.id}`);
    }
}