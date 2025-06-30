
$(document).ready(function () {
    $('#Cpf').mask('000.000.000-00');

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        const formElement = document.getElementById('formCadastro');
        const formData = new FormData(formElement);

        const cpf = document.querySelector('#Cpf').value;
        if (!isCpfValido(cpf)) {
            ModalDialog("Erro:", 'O CPF informado é inválido.');
            return;
        }

        ModalBeneficiarios.iniciar(); 

        formData.append('beneficiarios', JSON.stringify(ModalBeneficiarios.getBeneficiarios()));

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
        '  </div><!-- /.modal-dialog -->                                                                                    ' 
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
