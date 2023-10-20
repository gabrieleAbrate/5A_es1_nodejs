// http -> modulo indispensabile se voglio creare una comunicazione client-server
// url -> analizzare e parsificare l'url 
// require -> come una comune import
const { info } = require('console');
const http = require('http');
const url = require('url');

// 1° parametro: richiesta arrivata dal client
// 2° parametro: risposta che verrà inviata al client
let server = http.createServer((richiesta, risposta) => {
    // creo la mia risposta da inviare al client
    let testoRisposta = `
        url: ${richiesta.url}
        host: ${richiesta.headers.host}
        method: ${richiesta.method} 
    `;

    // parsifico l'url per ottenere le informazioni
    let indirizzo = richiesta.headers.host + richiesta.url;
    let infoUrl = url.parse(indirizzo, true);

    // aggiungo le informazioni dell'url alla risposta
    testoRisposta += `
        pathname: ${infoUrl.pathname}
        parametri: ${infoUrl.search}
    `;

    let header;
    switch(infoUrl.pathname){
        case '/richiesta':
            stampaRichiesta(testoRisposta, risposta, infoUrl);
            break;
        case '/index':
            header = {'Content-Type': 'text/html'};
            risposta.writeHead(200, header);
            risposta.write('<h1>Benvenuto nella home page</h1>');
            risposta.end();
            break;
        default:
            header = {'Content-Type': 'text/plain'};
            risposta.writeHead(404, header);
            risposta.write('nessuna risorsa trovata');
            risposta.end();
            break;
    }
});

// fondamentale per avviare il server
server.listen(1337);
console.log('il server è avviato sulla porta 1337');

function stampaRichiesta(testoRisposta, risposta, infoUrl){
    // recupero i parametri dall'url separati dal ?
    let parametri = infoUrl.query;
    testoRisposta += `
        action: ${parametri.action}
        parametro1: ${parametri.parametro1}
    `;

    // 1° parametro: codice di risposta -> 200 = OK
    // 2° parametro: oggetto json -> insieme di opzioni che vogliamo inserire nell'intestazione 
    // text/plain, text/html, application/json
    let header = {'Content-Type': 'text/plain'};
    risposta.writeHead(200, header);

    // modifico il contenuto del pacchetto (posso richiamare write più volte)
    risposta.write('hello world \n' + testoRisposta);

    // informo il server che ho finito di preparare il pacchetto di risposta
    risposta.end();
}