using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace HotelAPI.Models.Entities
{
    [Table("amenities")]
    public class AmenitiesModel : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public string? Id { get; set; }

        [Column("name")]
        public string? Name { get; set; }

    }
}
