using System.ComponentModel.DataAnnotations;

public class BeneficiarioModel
{
    public long Id { get; set; }
    /// <summary>
    /// Nome
    /// </summary>
    [Required]
    public string Nome { get; set; }
    /// <summary>
    /// CEP
    /// </summary>
    [Required(ErrorMessage = "O CPF é obrigatório")]
    [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "Digite um CPF válido (ex: 123.456.789-00)")]
    public string CPF { get; set; }

}
