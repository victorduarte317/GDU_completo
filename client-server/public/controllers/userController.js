// controlador, contem regras do que pode e do que nao pode acontecer

class UserController {

    constructor (formIdCreate, formIdUpdate, tableId){

        // Chamando os métodos
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate); 
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }

    onEdit() { // Ao clicar no botão de cancel dentro do formulario de edit

        // busca no documento a classe btn-cancel dentro de box-update e faz o eventlistener com arrowfunction
        document.querySelector("#box-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate(); 

        });

        this.formUpdateEl.addEventListener("submit", event =>{ // event listener pro formulario de atualizacao
            
            event.preventDefault(); // previne o tratamento de dados padrao

            let btn = this.formUpdateEl.querySelector("[type=submit]");  // seleciona o botao tipado submit desse formulario
            
            btn.disabled = true; // desabilita ele pra nao ter flood

            let values = this.getValues(this.formUpdateEl); // pega todos os valores / atribui o objeto do formulario de update tratado pela funçao get values à variavel values

            let index = this.formUpdateEl.dataset.trIndex; // atribui o valor do index de linhas dentro de dataset do objeto formupdateEl à variável index
            
            let tr = this.tableEl.rows[index]; // atribui esse index de cima as rows do objeto da tabela à variável tr

            let userOld = JSON.parse(tr.dataset.user);

            let objectMerge = Object.assign({}, userOld, values); // Elementos que estão a direita sobrescrevem os que estao a esquerda
                                                                // values sobrescreve userOld, userOld sobrescreve o elemento vazio

            this.getPhoto(this.formUpdateEl).then(

                (content)=> { 
                    // Aqui ele vai receber o content, que na verdade é o resultado do resolve.
                    // Quando der certo, a função vai ser executada.
                    if (!values.photo) {

                        objectMerge._photo = userOld._photo; // Se o campo de atribuiçao de foto estiver vazio, entao o resultado dele precisa ser o conteudo que tava la antes, a foto antiga
                    
                    } else {

                        objectMerge._photo = content;

                    }

                    let user = new User();

                    user.loadFromJSON(objectMerge);

                    user.saveUser().then(user =>{

                        this.getTr(user, tr); // chama o método getTr e passa user como primeiro parametro e sobrescreve o tr = null com o tr desse contexto

                        this.addEventsTr(tr); // adiciona a linha nova

                        this.updateCount(); // atualiza os contadores

                        this.formUpdateEl.reset(); // reseta os valores do formulario de update

                        btn.disabled = false;

                            this.showPanelCreate(); // mostra o formulario de criaçao de usuario de novo

                    });

                }, 
                
                function(e){ 
                    // Como o "this" não está sendo usado aqui, vou manter a function mesmo
                    // Quando der errado, essa função vai ser executada
                    // Ela recebe o evento "e" do reject

                    console.error(e);
        
                }
            )
        });
    }

    showPanelCreate() {

        document.querySelector("#box-update").style.display='none';
        document.querySelector("#box-create").style.display='block';
    }

    showPanelUpdate() {
        document.querySelector("#box-update").style.display='block';
        document.querySelector("#box-create").style.display='none';
    }

    onSubmit(){ // Método que vai ser executado no evento submit

        this.formEl.addEventListener("submit", event => { // Adicionando um listener do evento submit ao formulário via elemento formEl

            event.preventDefault(); // Prevenindo a ação padrão de tratamento de evento da pagina

            let btn = this.formEl.querySelector("[type=submit]"); // Armazena o tipo do botão do formulário na variável local btn

            btn.disabled = true; 

            let values = this.getValues(this.formEl); // a variável local values vai receber o getValues

            if (!values) return false; 
            // como values agora é booleano por conta da checagem feita antes do retorno de new Users, não é possivel atribuir "content" em value.photo, já que value agora é booleano.
            // então, essa verificação diz que, se values for falso, já retorna falso e para a execução do formulário.

            this.getPhoto(this.formEl).then(

                (content)=> { 
                    // Aqui ele vai receber o content, que na verdade é o resultado do resolve.
                    // Quando der certo, a função vai ser executada.

                    values.photo = content;

                    values.saveUser().then(user=>{ // quando a promessa acontecer, o bloco dentro atualiza a tela

                        this.addLine(user);

                        this.formEl.reset(); // Usa o () pro método ser executado
    
                        btn.disabled = false;
    
                        // Adicionando a linha criada e atribuindo os valores chamando o getValues                     
                        // o addLine vem pra cá já que ele só vai adicionar a linha depois que tudo estiver pronto

                    });

                }, 
                
                function(e){ // Como o "this" não está sendo usado aqui, vou manter a function mesmo
                    // Quando der errado, essa função vai ser executada
                    // Ela recebe o evento "e" do reject

                    console.error(e);
              
                }


            );
        
        });

    }

    // esse formulario tava amarrado ao create, ja que ele recebe o this.formEl.elements
    // pra desamarrar, ele precisa receber formEl como parametro e nao usar mais o "this" dentro do spread  
    getPhoto(formEl) {
        //return new Promise (function(resolve, reject)) dava erro já que o escopo do "this.formEl" passava a ser local, só da função. Então, pra resolver, é só usar a arrow function, o this vai voltar a existir no contexto.
        return new Promise((resolve, reject)=>{  // Retorna uma promise (classe) por meio de uma arrow function que recebe dois parâmetros. Se der certo, executa o resolve. Se der errado, o reject.

            let fileReader = new FileReader(); // No uso do comando, o construtor já é chamado

            let elements = [...formEl.elements].filter(item=>{ 
            // Como eu quero só elemento do campo da foto, usa-se o método filter pra filtrar o array, ele recebe cada item e checa se é uma foto.
            // elements vai receber o array já filtrado

            if (item.name === 'photo') { 
                return item;
            }
        });

        let file = elements[0].files[0]; 
        // Como os elementos são um array e são uma coleção HTML, eu quero só o primeiro elemento e só o primeiro arquivo desse elemento.
        // Como o codigo acima vai retornar um caminho pra imagem, esse caminho pode ser usado pelo fileReader.
        // Então, pra facilitar, os valores foram atribuidos a variavel file e ela vai ser manipulada pelo fileReader.

        fileReader.onload = () => {  
        // No carregar da imagem executa a função de callback, que seria uma função de retorno. Ou seja, quando terminar de executar o onLoad() (quando terminar de carregar a foto) executa a função de callback.

            resolve(fileReader.result); 
            // Aqui vai retornar o conteúdo que vai ser usado como URL da IMG(?)
            // Esse result vai cair no "content" la em cima
        };

        fileReader.onerror = (e)=> { // Quando o evento disparado der erro
            
            reject(e); // Rejeita o evento

        };
            
            if (file) { // Se o usuário inserir um arquivo de foto
                fileReader.readAsDataURL(file);
        
            } else {
                resolve('dist/img/boxed-bg.jpg'); // Precisa ser resolve pra inserção de arquivo não ser obrigatória, e se o usuário não colocar um arquivo, atribui-se a imagem que implica que o usuário não tem foto.
            }

        });

        
    }

    getValues(formEl){ // Método pra pegar os valores inseridos

        let user = {}; // Cria um array local
        let isValid = true; // VAlor padrão da verificação da validade do formulário

        // this.formEl.elements.forEach(function(field, index){ Esse código dava erro, já que o forEach não identificou um array.
        // Pra resolver, o this.formEl.elements foi transformado em um array. 
        // Porém, mesmo transformado em array, ainda precisaria especificar qual index deve ser percorrido, colocando o this.formEl.elements[1], this.formEl.elements[2] etc...
        // Então, o operador spread foi utilizado, com o [...this], fazendo com que não seja precisa essa especificação.

        [...formEl.elements].forEach(function(field, index) { // Percorre cada campo e cada posição (index) do formulário
        
        if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) { // se o index dos campos obrigatórios for >-1 e o valor do campo não for vazio

            // console.dir(field) vai acessar esse campo como se fosse um objeto. Explorando o console, é possível achar o elemento pai dele, em parentElement.
            // também vai dar pra ver a coleção desse campo em classList. Dentro dessa coleção, existem métodos, e um deles é o add. Então, isso significa que eu posso adicionar uma classe nele.
            // visando o reforço da obrigatoriedade de preenchimento dos campos, podemos acrescentar a classe externa 'has-error' do adminLTE, aplicação usada pra criar o layout do site.

            field.parentElement.classList.add('has-error');
            isValid = false;

            // basicamente, se a condiçao caiu em um dos campos requeridos no array e o valor tá vazio, para a execução do formulário
            

        }

            if (field.name === "gender") { // Se for o campo gender
    
                if (field.checked) { // E se o campo estiver selecionado
                    user[field.name] = field.value;  // O nome do campo no array vai receber o valor do campo
                }

                } else if(field.name == "admin") { // Se for o campo admin

                    user[field.name] = field.checked; // Vai checar e retornar true se tiver checkado e false se não tiver checkado.

                } else {

                    user[field.name] = field.value;
                }
            });

            if (!isValid) { // Vai verificar se, mesmo depois da verificação acima, o isValid ainda é falso
                return false; // Vai agir como um break e parar a execução do formulário
            }
    
        return new User( // Retorna as informações e atribui os valores aos campos do formulario
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    }

    // pega todas as informaçoes do usuario do localstorage, faz um foreach e adiciona eles na tela
    selectAll() {

        HttpRequest.get('/users').then(data=>{

            data.users.forEach(dataUser => {

                let user = new User();
                user.loadFromJSON(dataUser);
                this.addLine(user);
            });
            
        });

    }

    addLine(dataUser) { // Método pra adicionar uma linha na página

        let tr = this.getTr(dataUser); 
        this.tableEl.appendChild(tr);  // vai na tag table, até a ultima tabela, e adiciona esse tr - função do appendChild
        this.updateCount(); // Aqui, o updateCount vai analisar a atualizaçao da ficha criada e atualizar no contador
        
        // if ternário: Se for admin, então escreve "sim" e se não for, escreve "não".
        // if ternário é usado quando existem poucas validações, de preferência duas.
        // innerHTML vai interpretar os comandos dentro da template string e executá-los, adicionando efetivamente uma nova tabela no HTML.
        // Utils.dateFormat(dataUser.register) tá passando uma classe.métodoestático e o dataUser.register tá sendo passado como parâmetro e sendo tratado dentro da classe Utils.
        
        //appendChild vai fazer com que tudo que esteja sendo interpretado dentro de innerHTML seja filho da tag "tr", adicionando várias linhas na pagina.
    
    } 

    getTr(dataUser, tr = null) { // como precisamos ter acesso aos dados do usuario dentro desse metodo, ele precisa passar tais dados como parametro
                                 // existem partes do código que pegam um tr ja existente, então ele precisa ser passado aqui como null pra essas partes do codigo continuarem funcionando
        
        if (tr === null) tr = document.createElement('tr'); // se tr for nulo, cria um novo

        tr.dataset.user = JSON.stringify(dataUser);  
        // O método stringify do JSON tá serializando - ou seja, transformando o objeto em texto sem que ele perca suas propriedades - o dataUser, já que o dataset, por padrão, converte tudo pra string e essa conversão faz o objeto perder as propriedades.
        
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
    `;
        this.addEventsTr(tr);

        return tr;

    }

    addEventsTr(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", e=>{ // event listener no click do botao que tem a classe btn-delete

            if (confirm("Deseja realmente excluir? "))  { // confirm cria uma janela que retorna true se clicar em ok e false se clicar em cancelar
                
                let user = new User();

                user.loadFromJSON(JSON.parse(tr.dataset.user)); // pegar o JSON que ta guardado dentro da tag <tr> - com dataset - e colocar no objeto user

                user.remove().then(data=>{

                    tr.remove(); // metodo nativo, remove tr

                    this.updateCount(); // atualiza o contador

                });

            }

        });

        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user); // JSON ta transformando tr.dataset.user em objeto
    
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            
            for (let name in json) { // for in em que a variavel name percorre a variavel json

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]"); // field recebe a pesquisa dentro de "form", essa pesquisa retorna o texto [name = variavel name substituindo _ por nada]

                if (field) { // se field existe

                    switch (field.type) {
                        case 'file':
                        continue;
                        break;
                        
                        case 'radio':     
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name]; // atribui a variavel name de json ao valor da variavel nomes
                    }      // valor do objeto

                }
                
            }

            this.formUpdateEl.querySelector(".photo").src=json._photo; // vai procurar o elemento que tem a classe photo, substituir o src dele pelo json._photo (photo ainda tem _)

            this.showPanelUpdate();
        
        });
    }

    updateCount() { // Método pra trackear a contagem de atualizações no número de administradores/usuarios
        let numUsers = 0;
        let numAdmins = 0;
        
        [...this.tableEl.children].forEach(tr=>{ // o children é o campo que contém os elementos necessarios para que ocorra uma verificaçao linha por linha pra descobrir o numero de admin/clientes
        
            numUsers++; // adiciona +1 no numero de usuarios
            let user = JSON.parse(tr.dataset.user) // a variavel user vai receber a interpretação de tr.dataset.user, recebendo as propriedades de objeto de volta

            if (user._admin) numAdmins++; // se o usuário for um admin, adiciona +1 no numero de admns
        }); 
    
        document.querySelector("#number-users").innerHTML = numUsers; 
        document.querySelector("#number-users-admin").innerHTML = numAdmins;

        // busca o elemento que vai receber a adição do usuario no html, usa o .innerHTML pra alterar o valor e recebe o valor correspndente.
    
    }
}