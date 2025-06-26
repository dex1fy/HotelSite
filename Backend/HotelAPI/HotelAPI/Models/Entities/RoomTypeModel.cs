using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace HotelAPI.Models.Entities
{
    [Table("room_type")]
    public class RoomTypeModel : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("price")]
        public int Price { get; set; }

        [Column("capacities")]
        public int Capacities { get; set; }
    }
}
