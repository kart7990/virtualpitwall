using Aydsko.iRacingData.Cars;
using Aydsko.iRacingData.Common;
using Aydsko.iRacingData.Tracks;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Pitwall.Server.Core.iRacingData
{
    public class iRacingDataRepository
    {
        private const string CARS_KEY = "cars";
        private const string CAR_CLASSES_KEY = "carClasses";
        private const string CAR_ASSET_DETAILS_KEY = "carAssetDetails";
        private const string TRACKS_KEY = "tracks";
        private const string TRACKS_ASSETS_KEY = "trackAssets";
        private readonly TimeSpan TTL = TimeSpan.FromDays(3);
        private readonly IDatabase database;

        public iRacingDataRepository(IDatabase database)
        {
            this.database = database;
        }

        public async Task SetCars(CarInfo[] cars)
        {
            await database.StringSetAsync(BuildKey(CARS_KEY), JsonConvert.SerializeObject(cars), TTL);
        }

        public async Task<CarInfo[]> GetCars()
        {
            var data = await database.StringGetAsync(BuildKey(CARS_KEY));

            return JsonConvert.DeserializeObject<CarInfo[]>(data);
        }

        public async Task SetCarClasses(CarClass[] carClasses)
        {
            await database.StringSetAsync(BuildKey(CAR_CLASSES_KEY), JsonConvert.SerializeObject(carClasses), TTL);
        }

        public async Task<CarClass[]> GetCarClasses()
        {
            var data = await database.StringGetAsync(BuildKey(CAR_CLASSES_KEY));

            return JsonConvert.DeserializeObject<CarClass[]>(data);
        }

        public async Task SetCarAssetDetails(IReadOnlyDictionary<string, CarAssetDetail> carAssetDetails)
        {
            await database.StringSetAsync(BuildKey(CAR_ASSET_DETAILS_KEY), JsonConvert.SerializeObject(carAssetDetails), TTL);
        }

        public async Task<IReadOnlyDictionary<string, CarAssetDetail>> GetCarAssetDetails()
        {
            var data = await database.StringGetAsync(BuildKey(CAR_ASSET_DETAILS_KEY));

            return JsonConvert.DeserializeObject<IReadOnlyDictionary<string, CarAssetDetail>>(data);
        }

        public async Task SetTracks(Aydsko.iRacingData.Tracks.Track[] tracks)
        {
            await database.StringSetAsync(BuildKey(TRACKS_KEY), JsonConvert.SerializeObject(tracks), TTL);
        }

        public async Task<Aydsko.iRacingData.Tracks.Track[]> GetTracks()
        {
            var data = await database.StringGetAsync(BuildKey(TRACKS_KEY));

            return JsonConvert.DeserializeObject<Aydsko.iRacingData.Tracks.Track[]>(data);
        }

        public async Task SetTrackAssetDetails(IReadOnlyDictionary<string, TrackAssets> trackAssets)
        {
            await database.StringSetAsync(BuildKey(TRACKS_ASSETS_KEY), JsonConvert.SerializeObject(trackAssets), TTL);
        }

        public async Task<IReadOnlyDictionary<string, TrackAssets>> GetTrackAssetDetails()
        {
            var data = await database.StringGetAsync(BuildKey(TRACKS_ASSETS_KEY));

            return JsonConvert.DeserializeObject<IReadOnlyDictionary<string, TrackAssets>>(data);
        }

        public async Task<TimeSpan> GetTtl()
        {
            var ttl = TimeSpan.FromSeconds(0);
            var keyTtl = await database.KeyTimeToLiveAsync(BuildKey(TRACKS_ASSETS_KEY));

            if (keyTtl.HasValue)
            {
                ttl = keyTtl.Value;
            }

            return ttl;
        }

        private string BuildKey(string dataId)
        {
            return "ird:did#" + dataId;
        }
    }
}
