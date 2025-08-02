const path = require('path');
const fs = require('fs');
const express = require('express');

const port = 3000;

const app = express();

const cursosPath = path.join(__dirname, 'cursos.json');
const cursosData = fs.readFileSync(cursosPath, 'utf-8');
const cursos = JSON.parse(cursosData);

app.use(express.json());

app.use(express.urlencoded({extended: true}));

// SALVAR

function SalvarCursos(cursos){
    fs.writeFileSync(cursosPath, JSON.stringify(cursos, null, 2));
}

function SalvarDadosCurso(cursos){
    fs.writeFileSync(cursosPath, JSON.stringify(cursos, null, 2));
}

// EXCLUIR

function ExcluirCurso(cursos){
    fs.writeFileSync(cursosPath, JSON.stringify(cursos, null, 2));
}

// BUSCAR

function BuscarCursosNome(nome){
    const cursosData = fs.readFileSync(cursosPath, 'utf-8');
    const cursos = JSON.parse(cursosData);

    return cursos.filter(curso => String(curso.nome) === String(nome));
}

function BuscarCursosID(id){
    const cursosData = fs.readFileSync(cursosPath, 'utf-8');
    const cursos = JSON.parse(cursosData);

    return cursos.find(curso => curso.id.toLowerCase() === id.toLowerCase());
}

function BuscarCursosPeríodo(período){
    const cursosData = fs.readFileSync(cursosPath, 'utf-8');
    const cursos = JSON.parse(cursosData);

    return cursos.filter(curso => String(curso.período) === String(período));
}

// ROTA PRINCIPAL

app.get('/cursos', (req, res) => {
    let cursosTable = '';

    let cursosData = fs.readFileSync(cursosPath, 'utf-8');
    let cursos = JSON.parse(cursosData);

    cursos.forEach(curso => {
        cursosTable += `
            <tr>
                <th scope="col">${curso.id}</th>
                <th scope="col">${curso.nome}</th>
                <th scope="col">${curso.período}</th>
                <th scope="col">${curso.descrição}</th>
                <th><a href="http://localhost:3000/cursos/atualizar-curso?nome=${curso.nome}" class="btn btn-primary">Editar</a></th>
                <th><a href="http://localhost:3000/cursos/excluir-curso?nome=${curso.nome}" class="btn btn-danger">Excluir</a></th>
            </tr>
        `;
    });

    const htmlContent = fs.readFileSync('cursos.html', 'utf-8');
    const htmlFinal = htmlContent.replace('{{cursosTable}}', cursosTable);

    res.send(htmlFinal);
});

// BUSCAR -> ID

app.get('/cursos/id', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarcursoid.html'));
});

app.get('/cursos/id/resultado', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarcursoidresultado.html'));
});

app.post('/cursos/id/resultado', (req, res) => {
    const cursoBuscado = req.body.id;
    const cursoEncontrado = BuscarCursosID(cursoBuscado);

    if(cursoEncontrado){
       let CursoCardResultado = '';

                      CursoCardResultado += `
       
                        <div class="card">
                            <div class="card-header">
                                ID: ${cursoEncontrado.id}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Nome: ${cursoEncontrado.nome}</h5>
                                <p class="card-text">Período: ${cursoEncontrado.período}</p>
                                <p class="card-text">Descrição: ${cursoEncontrado.descrição}</p>
                                <a href="http://localhost:3000/cursos" class="btn btn-primary">Voltar</a>
                            </div>
                        </div>

       `;

       let htmlContent = fs.readFileSync('buscarcursoidresultado.html', 'utf-8');
       let htmlFinal = htmlContent.replace('{{CursoCardResultado}}', CursoCardResultado);

       res.send(htmlFinal);
    }
    else{
        res.send(`
             <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Busca Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Curso solicitado não encontrado, por favor, tente novamente.</p>
                <a href="http://localhost:3000/cursos" class="btn btn-outline-danger">Voltar</a>
                </div>  
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>          
            `);
            return;        
    }
});

// BUSCAR -> NOME

app.get('/cursos/nome', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarcursonome.html'));
});

app.get('/cursos/nome/resultado', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarcursonomeresultado.html'));
});

app.post('/cursos/nome/resultado', (req, res) => {
    let cursoBuscado = req.body.nome;
    let cursoEncontrado = BuscarCursosNome(cursoBuscado);

    if(cursoEncontrado.length > 0){
        let CursoCardResultado = '';

        cursoEncontrado.forEach(curso => {
                    CursoCardResultado += `

                            <div class="card">
                                <div class="card-header">
                                    ID: ${curso.id}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Nome: ${curso.nome}</h5>
                                    <p class="card-text">Período: ${curso.período}</p>
                                    <p class="card-text">Descrição: ${curso.descrição}</p>
                                    <a href="http://localhost:3000/cursos" class="btn btn-primary">Voltar</a>
                                </div>
                            </div>
        
        `;
        });

        let htmlContent = fs.readFileSync('buscarcursonomeresultado.html', 'utf-8');
        let htmlFinal = htmlContent.replace('{{CursoCardResultado}}', CursoCardResultado);

        res.send(htmlFinal);
    }
    else{
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Busca Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Curso solicitado não encontrado, por favor, tente novamente.</p>
                <a href="http://localhost:3000/cursos" class="btn btn-outline-danger">Voltar</a>
                </div>  
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>  
            
        `);
        return;
    }
});

// BUSCAR -> PERÍODO

app.get('/cursos/periodo', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarcursoperíodo.html'));
});

app.get('/cursos/periodo/resultado', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarcursoperíodoresultado.html'));
});

app.post('/cursos/periodo/resultado', (req, res) => {
    let cursoBuscado = req.body.período;
    let cursoEncontrado = BuscarCursosPeríodo(cursoBuscado);

    if(cursoEncontrado.length > 0){
        let CursoCardResultado = '';

        cursoEncontrado.forEach(curso => {
            CursoCardResultado += `

                            <div class="card">
                                <div class="card-header">
                                    ID: ${curso.id}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Nome: ${curso.nome}</h5>
                                    <p class="card-text">Período: ${curso.período}</p>
                                    <p class="card-text">Descrição: ${curso.descrição}</p>
                                    <a href="http://localhost:3000/cursos" class="btn btn-primary">Voltar</a>
                                </div>
                            </div>
            
            `
        });
        let htmlContent = fs.readFileSync('buscarcursoperíodoresultado.html', 'utf-8');
        let htmlFinal = htmlContent.replace('{{CursoCardResultado}}', CursoCardResultado);

        res.send(htmlFinal);
    }
    else{
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Busca Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Curso solicitado não encontrado, por favor, tente novamente.</p>
                <a href="http://localhost:3000/cursos" class="btn btn-outline-danger">Voltar</a>
                </div>  
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>  
            
        `);
        return;        
    }
});

// ADICIONAR

app.get('/cursos/adicionar-curso', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionarcurso.html'));
});

app.post('/cursos/adicionar-curso', (req, res) => {
    const novoCurso = req.body;

    const cursosData = fs.readFileSync(cursosPath, 'utf-8');
    const cursos = JSON.parse(cursosData);

    if(cursos.find(curso => curso.nome.toLowerCase() === novoCurso.nome.toLowerCase())){
        res.send(`
             <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Adicionar Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Curso solicitado já existe no banco de dados, por favor, tente novamente.</p>
                <a href="http://localhost:3000/cursos" class="btn btn-outline-danger">Voltar</a>
                </div>  
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>          
            `);
            return;
    }
    else if(cursos.find(curso => curso.id.toLowerCase() === novoCurso.id.toLowerCase())){
        res.send(`
            
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Adicionar Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">O ID desse curso já existe no banco de dados, por favor, tente novamente.</p>
                <a href="http://localhost:3000/cursos" class="btn btn-outline-danger">Voltar</a>
                </div>  
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>  
            
        `);
            return;
    }
    else{
        cursos.push(novoCurso);

        SalvarCursos(cursos);

        res.send(`

             <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Adicionar Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="alert alert-success text-center shadow" role="alert">
                <h4 class="alert-heading">Sucesso!</h4>
                <p class="fw-semibold">Novo curso adicionado com sucesso!</p>
                <a href="http://localhost:3000/cursos" class="btn btn-outline-primary">Voltar</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>
            
            `);
    }
});

// ATUALIZAR

app.get('/cursos/atualizar-curso', (req, res) => {    
    const nomeCurso = req.query.nome || '';

    res.send(`
        
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Atualizar Curso</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
                </head>
                <body>
                    <a href="http://localhost:3000/cursos" class="btn btn-primary" style="margin-top: 20px;">Voltar</a><br><br>
                    <form action="http://localhost:3000/cursos/atualizar-curso" method="post">
                        <div class="mb-3">
                            <label for="id" class="form-label">ID do Curso</label>
                            <input type="number" class="form-control" id="id" name="id" required>
                        </div>
                        <div class="mb-3">
                            <label for="nome_escolhido" class="form-label">Nome do Curso Escolhido</label>
                            <input type="text" class="form-control" id="nome_escolhido" name="nome_escolhido" value="${nomeCurso}" disabled>
                            <input type="hidden" name="nome" value="${nomeCurso}">
                        </div>
                            <div class="mb-3" style="max-width: 300px;">
                                <label for="período" class="form-label">Período</label>
                                    <div class="col">
                                        <div class="form-floating">
                                            <select class="form-select mb-3" id="período" name="período" required>
                                                <option value="" selected disabled>Selecione uma das opções</option>
                                                <option value="Manhã"><p class="text-primary">Manhã</p></option>
                                                <option value="Tarde">Tarde</option>
                                                <option value="Noite">Noite</option>
                                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="descrição">Descrição</label><br>
                                <textarea name="descrição" id="descrição" placeholder="Escreva suas sabissões" required></textarea>
                            </div>
                        <button type="submit" class="btn btn-primary">Enviar</button>
                </form>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossorigin="anonymous"></script>
                </body>
            </html>
        
        `);
});

app.post('/cursos/atualizar-curso', (req, res) => {
    const { id, nome, período, descrição } = req.body;

    let cursosData = fs.readFileSync(cursosPath, 'utf-8');
    let cursos = JSON.parse(cursosData);

    const cursosIndex = cursos.findIndex(curso => curso.nome.toLowerCase() === nome.toLowerCase());

    if(cursosIndex == -1){
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Atualizar Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">O curso solicitado não existe, por favor, tente novamente</p>
                <hr>
                <a href="http://localhost:3000/cursos/atualizar-curso" class="btn btn-outline-danger">Voltar</a>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>
            
        `);
        return;
    }
    else{
        cursos[cursosIndex].id = id;
        cursos[cursosIndex].nome = nome;
        cursos[cursosIndex].período = período;
        cursos[cursosIndex].descrição = descrição;

        SalvarDadosCurso(cursos);

        res.send(`

            <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro - Adicionar Curso</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body class="bg-light">
                    <div class="alert alert-success text-center shadow" role="alert">
                    <h4 class="alert-heading">Sucesso!</h4>
                    <p class="fw-semibold">Curso atualizado com sucesso!</p>
                    <a href="http://localhost:3000/cursos" class="btn btn-outline-primary">Voltar</a>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
                </script>
            </html>
            
            `);
    }
});

// EXCLUIR

app.get('/cursos/excluir-curso', (req, res) => {
    const cursoBuscado = req.query.nome;

    let cursosData = fs.readFileSync(cursosPath, 'utf-8');
    let cursos = JSON.parse(cursosData);

    const cursosIndex = cursos.findIndex(curso => curso.nome.toLowerCase() === cursoBuscado.toLowerCase());

    if(cursosIndex == -1){
        res.send(`

            <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro - Excluir Curso</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body class="bg-light">
                <div class="container mt-5">
                    <div class="alert alert-danger text-center shadow" role="alert">
                    <h4 class="alert-heading">Erro!</h4>
                    <p class="fw-semibold">O curso solicitado não existe, por favor, tente novamente</p>
                    <hr>
                    <a href="http://localhost:3000/cursos/atualizar-curso" class="btn btn-outline-danger">Voltar</a>
                    </div>
                </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
                </script>
            </html>
            
            `);
            return;
    }
    else{
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmação - Excluir Curso</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-warning text-center shadow" role="alert">
                <h4 class="alert-heading">Atenção!</h4>
                <p class="fw-semibold">Tem certeza de que quer excluir o curso <strong>${cursoBuscado}</strong>?</p>
                <hr>
                <div class="d-grid gap-2 d-md-block">
                    <a class="btn btn-success" href="http://localhost:3000/cursos/excluir-curso-confirmado?nome=${cursoBuscado}">Sim</a>
                    <a href="http://localhost:3000/cursos" class="btn btn-danger">Não</a>
                </div>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>
            
            `);
    }
});

app.get('/cursos/excluir-curso-confirmado', (req, res) => {
    const cursoBuscado = req.query.nome;

    let cursosData = fs.readFileSync(cursosPath, 'utf-8');
    let cursos = JSON.parse(cursosData);

    const cursosIndex = cursos.findIndex(curso => curso.nome.toLowerCase() === cursoBuscado.toLowerCase());

    cursos.splice(cursosIndex, 1);
    ExcluirCurso(cursos);

    res.send(`

            <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro - Adicionar Curso</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body class="bg-light">
                    <div class="alert alert-success text-center shadow" role="alert">
                    <h4 class="alert-heading">Sucesso!</h4>
                    <p class="fw-semibold">Curso removido com sucesso!</p>
                    <a href="http://localhost:3000/cursos" class="btn btn-outline-primary">Voltar</a>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
                </script>
            </html>
        
        `);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/cursos`);
});