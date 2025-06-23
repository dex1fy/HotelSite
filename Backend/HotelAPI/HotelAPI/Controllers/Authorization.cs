using HotelAPI.Models.DTOs.Registration;
using HotelAPI.Models.Entities;
using HotelAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Supabase.Gotrue;
using System.Security.Claims;

namespace HotelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SupabaseService _supabaseService;
        public AuthenticationController(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        [HttpPost("RegisterGuest")]
        public async Task<IActionResult> RegisterGuestAsync([FromBody] RegistrationRequest request)
        {
            var supabaseClient = await _supabaseService.InitSupabase();

            // проверяет, соответствие модели, указанным правилам в DTO (посмотрите модель RegisterRequest)
            if (!ModelState.IsValid)
                return BadRequest(new ProblemDetails { Title = "the email or password is incorrect" }); // если данные невалидны (почта, пароль), то возвращаем 400

            // проверка соответствия пароля
            if (request.Password != request.ConfirmPassword)
                return BadRequest(new ProblemDetails { Title = "passwords don't match" });

            //проверка на существующего гостя
            var existGuest = await supabaseClient.From<GuestModel>().Where(g =>  g.GuestEmail == request.Email).Single();

            if (existGuest != null)
                return BadRequest(new ProblemDetails { Title = "the guest with this username already exists" });

            // регистрация
            var register = await supabaseClient.Auth.SignUp(
                email: request.Email,
                password: request.Password
            );
            if (register != null)
            {
                var guestModel = new GuestModel
                {
                    Id = Guid.Parse(register.User.Id),
                    GuestName = request.Name,
                    GuestEmail = request.Email,
                };

                // заполянем таблицу пользователей (не аутентификация)
                var guest = await supabaseClient.From<GuestModel>().Insert(guestModel);

                return Ok(new
                {
                    message = $"successful guest registration {guestModel.GuestEmail}"
                });
            }
            return BadRequest("guest registration error");
        }
    }
}

