using System.ComponentModel.DataAnnotations;

namespace HotelAPI.Models.DTOs.Registration
{
    // реквест для регистрации
    public class RegistrationRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Required, Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
