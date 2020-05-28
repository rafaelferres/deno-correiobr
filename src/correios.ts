import xmljson from "https://dev.jspm.io/xml-js";

class Correios{

    public getPrecoPrazo(options : calcPrecoPrazo){
        let _opt = { ...calcPrecoPrazoDefault, ...options};
        _opt.sCepDestino = this.sanitization(_opt.sCepDestino);
        _opt.sCepOrigem = this.sanitization(_opt.sCepOrigem);
        let url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?sCepOrigem=${_opt.sCepOrigem}&sCepDestino=${_opt.sCepDestino}&nVlPeso=${_opt.nVlPeso}&nCdFormato=${_opt.nCdFormato}&nVlComprimento=${_opt.nVlComprimento}&nVlAltura=${_opt.nVlAltura}&nVlLargura=${_opt.nVlLargura}&sCdMaoPropria=${_opt.sCdMaoPropria}&nVlValorDeclarado=${_opt.nVlValorDeclarado}&sCdAvisoRecebimento=${_opt.sCdAvisoRecebimento}&nCdServico=${_opt.nCdServico}&nVlDiametro=${_opt.nVlDiametro}&StrRetorno=xml&nIndicaCalculo=3`;
        let x = this.fetchPrecoPrazo(url);
        return x;
    }

    public fetchPrecoPrazo(url : string){
        let options = {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
          };

        let response = fetch(url, options)
          .then(this.handleResponse)
          .then(this.checkForError)
          .catch(this.throwError);
        return response;
    }

    private handleResponse(response: Response) {
        var dataAsJson : any = {};
        return response.ok ?
            response.arrayBuffer().then(async (data) => {
                const reader = new Deno.Buffer(data);
                const bufferContent = await Deno.readAll(reader);
                const decoder = new TextDecoder("iso-8859-1");
                let decodedData = decoder.decode(bufferContent);
                return decodedData;
            }).then((str) => {
                var convert = xmljson;
                dataAsJson =  JSON.parse(convert.xml2json(str, {compact: true, spaces: 4}));
                dataAsJson = {
                    Codigo: dataAsJson.Servicos.cServico.Codigo._text,
                    Valor: dataAsJson.Servicos.cServico.Valor._text,
                    PrazoEntrega: dataAsJson.Servicos.cServico.PrazoEntrega._text,
                    ValorSemAdicionais: dataAsJson.Servicos.cServico.ValorSemAdicionais._text,
                    ValorMaoPropria: dataAsJson.Servicos.cServico.ValorMaoPropria._text,
                    ValorAvisoRecebimento: dataAsJson.Servicos.cServico.ValorAvisoRecebimento._text,
                    ValorDeclarado: dataAsJson.Servicos.cServico.ValorValorDeclarado._text,
                    EntregaDomiciliar: dataAsJson.Servicos.cServico.EntregaDomiciliar._text,
                    EntregaSabado: dataAsJson.Servicos.cServico.EntregaSabado._text,
                    obsFim: dataAsJson.Servicos.cServico.obsFim._text,
                    Erro: dataAsJson.Servicos.cServico.Erro._text,
                    MsgErro: dataAsJson.Servicos.cServico.MsgErro._cdata,
                  };
                return dataAsJson;
            }) : Error("Erro ao tentar se comunicar ao serviço dos correios.");
    }

    private checkForError(response: any) {
        return response.erro === true
          ? new Error("Esse Cep não foi encontrado na base de dados.")
          : response;
    }

    private sanitization(cep: string): string {
        const sanitizedZip = cep.toString().replace(/[^0-9]|[/ /]/g, "");
        if(sanitizedZip.length === 8){
            return sanitizedZip
        }else{
            throw Error (`Cep inválido: '${cep}'`);
        }
    }

    private throwError(error: any) {
        return error.name === "FetchError"
          ? Error("Erro ao se conectar com o serviço dos Correios.")
          : error;
    }
}

interface calcPrecoPrazo {
    sCepOrigem: string,
    sCepDestino:  string,
    nVlPeso: string,
    nCdFormato: string,
    nVlComprimento: string,
    nVlAltura: string,
    nVlLargura: string,
    nCdServico: string,
    nVlDiametro: string,
    nCdEmpresa? : string,
    sDsSenha? : string,
    sCdMaoPropria? : string,
    nVlValorDeclarado? : number,
    sCdAvisoRecebimento? : string
}

const calcPrecoPrazoDefault: calcPrecoPrazo = {
    sCepOrigem : "",
    sCepDestino : "",
    nVlPeso : "",
    nCdFormato : "",
    nVlComprimento : "",
    nVlAltura : "",
    nVlLargura : "",
    nCdServico : "",
    nVlDiametro : "",
    nCdEmpresa : "",
    sDsSenha : "",
    sCdMaoPropria : "n",
    nVlValorDeclarado : 0,
    sCdAvisoRecebimento : "n"
};

export default Correios;