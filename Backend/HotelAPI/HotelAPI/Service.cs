namespace HotelAPI.Services
{
    public class SupabaseService 
    {
        private readonly IConfiguration _configuration; // переменная конфигурации 
        private string _supabaseUrl; // ссылка на проект супабейз 
        private string _supabaseKey; // ключ от этого проекта
        private Supabase.Client _supabaseClient; // экземпляр клиента 

        public SupabaseService(IConfiguration configuration) // конструктор с передачей конфигурации 
        {
            _configuration = configuration; 
            _supabaseUrl = _configuration["Supabase:Url"]; // ссылка и ключ закрыты и берутся из appsettings.Development.json.
            _supabaseKey = _configuration["Supabase:Key"];
        }

        // метод инициализации клиента супабейза
        public async Task<Supabase.Client> InitSupabase()
        {
            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true,
                AutoRefreshToken = true,
            };

            // создание клиента
            _supabaseClient = new Supabase.Client(_supabaseUrl, _supabaseKey, options);
            await _supabaseClient.InitializeAsync();

            // возврат клиента
            return _supabaseClient;
        }
    }
}
