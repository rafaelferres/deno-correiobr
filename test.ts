import { Cep, Correios } from './mod.ts';
import Rastreio from './src/rastreio.ts';

let cep = new Cep();
cep.requestViaCepService("01311-922").then((response) => {
    console.log(response);
});

let correios = new Correios();
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
  }).then((response) => {
      console.log(response);
});

let rastreio = new Rastreio();
rastreio.rastrear(["OJ576775628BR"]).then((response) => {
    console.log(response);
});