using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace HotelAPI.Models.Entities
{
    // модель гостя 
    [Table("guests")]
    public class GuestModel : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("surname")]
        public string? GuestSurname { get; set; }

        [Column("name")]
        public string? GuestName { get; set; }

        [Column("patronymic")]
        public string? GuestPatronymic { get; set; }

        [Column("email")]
        public string? GuestEmail { get; set; }

        [Column("phone")]
        public string? GuestPhone { get; set; }

      
    }
}