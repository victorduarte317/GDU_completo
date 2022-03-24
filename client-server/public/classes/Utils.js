class Utils { 
    static dateFormat(date) { // Método estático - não precisa ser instanciado pra ser chamado, ou seja, não precisa criar um objeto pra utilizá-lo
        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
    }
}