using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace HotelAPI.Models.Entities
{
    [Table("rooms")]
    public class RoomModel : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("room_number")]
        public int RoomNumber { get; set; }

        [Column("room_type_id")]
        public Guid RoomTypeId { get; set; }

        [Column("floor")]
        public int Floor { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("status")]  
        public bool Status { get; set; }

        [Column("guests")]
        public int Guests { get; set; }


    }
}
