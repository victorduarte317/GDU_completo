class HttpRequest {

    static get(url, params = {}) { // criou o método estático

        return HttpRequest.request('GET', url, params); // vai retornar o retorno do request

    }

    static delete(url, params = {}) { // criou o método estático

        return HttpRequest.request('DELETE', url, params); // vai retornar o retorno do request

    }

    static put(url, params = {}) { // criou o método estático

        return HttpRequest.request('PUT', url, params); // vai retornar o retorno do request

    }

    static post(url, params = {}) { // criou o método estático

        return HttpRequest.request('POST', url, params); // vai retornar o retorno do request

    }

    
    static request(method, url, params = {}){ // metodo estatico permite ser chamado sem que haja uma instancia da classe dele

        return new Promise((resolve, reject)=>{

            let ajax = new XMLHttpRequest(); // um novo request XMLHttp

            ajax.open(method.toUpperCase(), url); // recebe como parametro o método que vai usar e qual rota ele vai chamar
            
            ajax.onerror = events =>{

                reject(e);
            
            };
            
            ajax.onload = events => { // assim que carregar

            let obj = {};

            try 
            {
                obj = JSON.parse(ajax.responseText); // transforma o método responseText em um array JSON
            
            } catch(e) {

                reject(e); // passa qual foi o erro
                console.error(e);

            }

            resolve(obj);

        };

        ajax.setRequestHeader('Content-type', 'application/json');

        ajax.send(JSON.stringify(params));


        });
        
    }
}