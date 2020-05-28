import cheerio from "https://dev.jspm.io/cheerio@1.0.0-rc.3";

class Rastreio{
    data: any = [];

    public rastrear(codigo: Array<string>){
        const response = Promise.all(
            codigo.map((code) => this.fetchRastreio(code))
          ).then(() => {
            const { ...events } = this.data;
            return events;
          });
          return response;
    }

    private fetchRastreio(codigo: string){
        var options : RequestInit = {
            method: "GET",
            mode: "no-cors",
            headers: {
                "Content-Type": "text; charset=utf-8",
                "cache-control": "no-cache",
            },
        };

        return fetch(`https://www.linkcorreios.com.br/${codigo}`, options)
                .then(this.handleResponse)
                .then(this.checkForError)
                .then((response) => this.handleBody(response))
                .catch(this.throwError);
    }

    private handleResponse(response: Response): any{
        return response.ok
          ? response.arrayBuffer().then(async (arrayBuffer) => {
                const reader = new Deno.Buffer(arrayBuffer);
                const bufferContent = await Deno.readAll(reader);
                const decoder = new TextDecoder("utf-8");
                let decodedData = decoder.decode(bufferContent);
                return decodedData;
            })
          : Error("Erro ao tentar se comunicar ao serviço dos correios.");
    }

    private handleBody(responseObject: string) {
        var strs: any = [];
        var ret: any = [];
        var html = cheerio.load(responseObject);
        this.wrapData(html, strs, ret);
        if (!ret.length) {
          return { events: [] };
        } else {
          ret = JSON.parse(JSON.stringify(ret.reverse()));
          ret.shift();
          this.data.push(ret);
        }
    }

    private wrapData(html: any, strs: any, ret: any) {
        html(".linha_status").each(function (index: any, elem: any) {
          strs.push(elem);
        });
        strs.forEach((element: any) => {
          let responseObject: any = {};
          html(element)
            .find("li")
            .each(function (index: any, elem: any) {
              let text = html(elem).text();
              if (text && text.includes("Status")) {
                responseObject.status = text;
              }
              if (text && text.includes("Data")) {
                responseObject.data = text;
              }
              if (text && text.includes("Local")) {
                responseObject.local = text;
              }
              if (text && text.includes("Origem")) {
                responseObject.origem = text;
              }
              if (text && text.includes("Destino")) {
                responseObject.destino = text;
              }
            });
          ret.push(responseObject);
        });
    }

    private checkForError(responseObject: any) {
        return responseObject.erro === true
          ? Error("Esse Objeto não foi encontrado na base de dados.")
          : responseObject;
    }

    private throwError(error: Error) {
        return error.name === "FetchError"
          ? "Erro ao se conectar com o serviço dos Correios."
          : error;
      }
}

export default Rastreio;