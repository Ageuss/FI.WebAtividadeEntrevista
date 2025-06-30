
$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #Cpf').val(obj.CPF);
    }


    if (obj.Id) {
        $.get(`/Cliente/ObterBeneficiario?id=${obj.Id}`, function (beneficiarios) {
            if (Array.isArray(beneficiarios)) {
                beneficiarios.forEach(function (b) {
                    ModalBeneficiarios.getBeneficiarios().push({ Nome: b.Nome, Cpf: b.CPF });

                    const novaLinha = document.createElement('tr');
                    novaLinha.innerHTML = `
                            <td>${b.CPF}</td>
                            <td>${b.Nome}</td>
                            <td>
                                <button type="button" class="btn btn-sm btn-info btn-alterar" data-cpf="${b.CPF}">Editar</button>
                                <button type="button" class="btn btn-sm btn-info btn-remover">Remover</button>
                            </td>
                        `;
                    document.querySelector('#gridBeneficiarios tbody').appendChild(novaLinha);
                });
            }
        });
    }


    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        const formElement = document.getElementById('formCadastro');


        const formData = new FormData(formElement);

        const cpf = document.querySelector('#Cpf').value;

        if (!isCpfValido(cpf)) {
            ModalDialog("Erro:", 'O CPF informado é inválido.');
            return;
        }
        formData.append('beneficiarios', JSON.stringify(ModalBeneficiarios.getBeneficiarios()));
        formData.append('beneficiariosRemovidos', JSON.stringify(ModalBeneficiarios.getBeneficiariosRemovidos()));

        $.ajax({
            url: urlPost,
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function isCpfValido(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcularDigito = (base, fator) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
            soma += parseInt(base.charAt(i)) * (fator - i);
        }
        let resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const digito1 = calcularDigito(cpf.slice(0, 9), 10);
    const digito2 = calcularDigito(cpf.slice(0, 9) + digito1, 11);

    return cpf.endsWith(`${digito1}${digito2}`);
}