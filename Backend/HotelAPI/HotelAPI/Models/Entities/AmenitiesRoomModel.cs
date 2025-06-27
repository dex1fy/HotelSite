using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace HotelAPI.Models.Entities
{
    [Table("amenities_in_room")]
    public class AmenitiesRoomModel : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("id_room")]
        public string? IdRoom { get; set; }

        [Column("id_amenities")]
        public string? IdAmenities { get; set; }
    }
}
