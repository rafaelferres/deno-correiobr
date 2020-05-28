# Deno CorreioBR
CorreiosBR is a complete tool for those looking for ease of application, optimizing their online store and their service, such as: consult zip code information, calculate price and delivery times for orders and also track everything in one place , thus streamlining day-to-day processes and demands.

## How to query a zip code

    import  {  Cep }  from  'https://deno.land/x/deno_correiobr/mod.ts';
    let cep  =  new  Cep();
    cep.requestViaCepService("01311-922").then((response)  =>  {
    	console.log(response);
    });
Response:

    {
      cep: "01311-922",
      logradouro: "Avenida Paulista 1195",
      complemento: "",
      bairro: "Bela Vista",
      localidade: "São Paulo",
      uf: "SP",
      unidade: "",
      ibge: "3550308",
      gia: "1004"
    }

## How to check the price and delivery time of an order

    import  { Correios  }  from  'https://deno.land/x/deno_correiobr/mod.ts';
    let correios  =  new  Correios();
    
    correios.getPrecoPrazo({
	    sCepOrigem:  "01311-922",
	    sCepDestino:  "69923-000",
	    nVlPeso:  "1",
	    nCdFormato:  "1",
	    nVlComprimento:  "20",
	    nVlAltura:  "20",
	    nVlLargura:  "20",
	    nCdServico:  "04014",
	    nVlDiametro:  "0",
    }).then((response)  =>  {
	    console.log(response);
    });
Response:

    {
      Codigo: "04014",
      Valor: "94,80",
      PrazoEntrega: "7",
      ValorSemAdicionais: "94,80",
      ValorMaoPropria: "0,00",
      ValorAvisoRecebimento: "0,00",
      ValorDeclarado: "0,00",
      EntregaDomiciliar: "S",
      EntregaSabado: "N",
      obsFim: undefined,
      Erro: "0",
      MsgErro: undefined
    }

## How to track an order

    import  {  Rastreio  }  from  'https://deno.land/x/deno_correiobr/mod.ts';
    let rastreio  =  new  Rastreio();

    rastreio.rastrear(["OJ576775628BR"]).then((response)  =>  {
	    console.log(response);
    });
Response:

    {
      0: [
        {
            status: "Status: Objeto encaminhado ",
            data: "Data  : 19/05/2020 | Hora: 17:40",
            origem: "Origem: AGF CORREIA DIAS - Santo Andre / SP",
            destino: "Destino: CTCE VILA MARIA - Sao Paulo / SP"
          },
        {
            status: "Status: Objeto encaminhado ",
            data: "Data  : 21/05/2020 | Hora: 06:22",
            origem: "Origem: CTCE VILA MARIA - Sao Paulo / SP",
            destino: "Destino: CDD TATUAPE - Sao Paulo / SP"
          },
        {
            status: "Status: Objeto saiu para entrega ao destinatário",
            data: "Data  : 22/05/2020 | Hora: 10:48",
            local: "Local: CDD TATUAPE - Sao Paulo / SP"
          },
        {
            status: "Status: Objeto entregue ao destinatário",
            data: "Data  : 22/05/2020 | Hora: 12:16",
            local: "Local: CDD TATUAPE - Sao Paulo / SP"
          },
        {
            status: "Status: Objeto entregue ao destinatário",
            data: "Data  : 22/05/2020 | Hora: 12:16",
            local: "Local: CDD TATUAPE - Sao Paulo / SP"
          }
    ]
    }
