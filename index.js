var Nightmare = require('nightmare'),
    path = require('path');
var fs = require('fs');

async function run() {
    var nightmare = Nightmare({
            show: true
        }),
        MAX_PAGE = 10000,
        currentPage = 0,
        nextExists = true,
        paginas = [];
    let questoes = [];
    await nightmare
        .viewport(1280, 720)
        .goto("https://www.aprovaconcursos.com.br/questoes-de-concurso/")
        //.goto("https://www.aprovaconcursos.com.br/questoes-de-concurso/questoes/disciplina/Sistemas+de+Informa%25C3%25A7%25C3%25A3o+%2528TI%2529/")
        .click('#help-box-close')
        .click('#login-link')
        .type('#username', 'olixis@gmail.com')
        .type('#password', 'hahaha123')
        .click('#bt-login-top')
        .wait('#questoes')


    nextExists = await nightmare.visible('a[aria-label="Next"]');

    while (nextExists && currentPage < MAX_PAGE) {
        try {
            paginas.push(await nightmare
                .evaluate(function () {
                    //scope inside the browser, do the crawling here!
                    var pagina = new Object();
                    var gabarito = []
                    titulos = Array.from(document.querySelectorAll(".barra-top-2.col-sm-12"), x => x.innerText);
                    enunciados = Array.from(document.querySelectorAll(".col-sm-8"), x => x.innerText);
                    //crawl for the gabarito
                    for (var i = 0; i < document.querySelectorAll(".alternativas.row").length; i++) {
                        var element = document.querySelectorAll(".alternativas.row")[i];
                        for (var index = 0; index < element.childNodes[1].childNodes[1].length; index++) {
                            var elemento = element.childNodes[1].childNodes[1][index];
                            if (elemento.dataset.correta !== undefined) {
                                if (elemento.dataset.correta === '1') {
                                    gabarito.push(elemento.dataset.opcao);
                                }
                            }
                        }
                    }
                    //
                    alternativas = Array.from(document.querySelectorAll(".alternativas.row"), x => x.innerText);
                    pagina.titulos = titulos;
                    pagina.enunciados = enunciados;
                    pagina.alternativas = alternativas;
                    pagina.gabarito = gabarito;
                    return pagina;
                }));
        } catch (error) {
            console.log(error)
        }
        //debug
        // await nightmare.wait(500000)

        await nightmare
            .click('a[aria-label="Next"]')
            .wait('#questoes')
        console.info(currentPage);
        currentPage++;
        nextExists = await nightmare.visible('a[aria-label="Next"]');
    }
    try {
        for (var a = 0; a < paginas.length; a++) {
            for (var b = 0; b < paginas[a].titulos.length; b++) {
                let questao = {};
                questao.titulo = paginas[a].titulos[b].split("\n");
                questao.enunciado = paginas[a].enunciados[b].split("\n");
                questao.alternativas = paginas[a].alternativas[b].split("\n");
                questao.gabarito = paginas[a].gabarito[b];
                questoes.push(questao);
            }
        }
    } catch (error) {
        console.log(error);
    }


    //questao.titulo =  paginas[0].titulos[0].split("\n");
    //questao.enunciado = paginas[0].enunciados[0].split("\n");
    //questao.alternativas = paginas[0].alternativas[0].split("\n"); 
    await fs.writeFile("output.json", JSON.stringify(questoes), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    await nightmare.end();
}

run()
