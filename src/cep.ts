class Cep {


    public async requestViaCepService(cep: string){
        let url = `https://viacep.com.br/ws/${cep}/json/`;

        let options = {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        }

        let res = fetch(url, options).then(this.handleResponse).then(this.checkResponse).catch(this.errorService);
        return res;
    }

    private async handleResponse(response: Response){
        return response.ok ? response.json().then((json) => {
            return json;
        }) : Error("Falha ao se comunicar com o serviço");
    }

    private async checkResponse(response: any){
        return response.erro === true
            ? { tag: "INVALID_CEP", error:  "Esse Cep não foi encontrado na base de dados"}
        : response;
    }

    private async errorService(error: any){
        return Error(error);
    }
}

export default Cep;