using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using Newtonsoft.Json;
using System.Reflection;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel clienteModel, string beneficiarios)
        {
            BoCliente boCliente = new BoCliente();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {

                bool verifyCPF = boCliente.VerificarExistencia(clienteModel.CPF);

                if (verifyCPF)
                {
                    return Json("CPF já cadastrado");
                }
                   
                else
                {
                    clienteModel.Id = boCliente.Incluir(new Cliente()
                    {
                        CEP = clienteModel.CEP,
                        Cidade = clienteModel.Cidade,
                        Email = clienteModel.Email,
                        Estado = clienteModel.Estado,
                        Logradouro = clienteModel.Logradouro,
                        Nacionalidade = clienteModel.Nacionalidade,
                        Nome = clienteModel.Nome,
                        Sobrenome = clienteModel.Sobrenome,
                        Telefone = clienteModel.Telefone,
                        CPF = clienteModel.CPF
                    });

                    List<BeneficiarioModel> beneficiarioModels = JsonConvert.DeserializeObject<List<BeneficiarioModel>>(beneficiarios);

                    BoBeneficiario boBeneficiario = new BoBeneficiario();

                    foreach (var listBeneficiarios in beneficiarioModels)
                    {
                        boBeneficiario.Incluir(new Beneficiario()
                        {
                            ClienteId = clienteModel.Id,
                            Nome = listBeneficiarios.Nome,
                            CPF = listBeneficiarios.CPF
                        });
                    }
                   
                }
                       
                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel clienteModel, string beneficiarios, string beneficiariosRemovidos)
        {
            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = clienteModel.Id,
                    CEP = clienteModel.CEP,
                    Cidade = clienteModel.Cidade,
                    Email = clienteModel.Email,
                    Estado = clienteModel.Estado,
                    Logradouro = clienteModel.Logradouro,
                    Nacionalidade = clienteModel.Nacionalidade,
                    Nome = clienteModel.Nome,
                    Sobrenome = clienteModel.Sobrenome,
                    Telefone = clienteModel.Telefone,
                    CPF = clienteModel.CPF
                });

                List<BeneficiarioModel> edit = JsonConvert.DeserializeObject<List<BeneficiarioModel>>(beneficiarios);
                var remove = JsonConvert.DeserializeObject<List<string>>(beneficiariosRemovidos);

                BoBeneficiario boBeneficiario = new BoBeneficiario();

                foreach (var listBeneficiario in edit)
                {
                    Beneficiario beneficiario = boBeneficiario.Consultar(clienteModel.Id, listBeneficiario.CPF);

                    if(beneficiario == null)
                    {
                        boBeneficiario.Incluir(new Beneficiario()
                        {
                            ClienteId = clienteModel.Id,
                            Nome = listBeneficiario.Nome,
                            CPF = listBeneficiario.CPF
                        });
                    }
                    else
                    {
                        beneficiario.Nome = listBeneficiario.Nome;
                        beneficiario.CPF = listBeneficiario.CPF;

                        boBeneficiario.Alterar(beneficiario);              
                    }
 
                }

                foreach (var cpf in remove)
                {
                    boBeneficiario.Excluir(clienteModel.Id, cpf);
                }

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    CPF = cliente.CPF,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone
                };

            
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult ObterBeneficiario(int id)
        {
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            var beneficiarios = boBeneficiario.Listar()
            .Where(b => b.ClienteId == id)
            .Select(b => new { b.Nome, b.CPF })
            .ToList();

            return Json(beneficiarios, JsonRequestBehavior.AllowGet);
        }

    }
}