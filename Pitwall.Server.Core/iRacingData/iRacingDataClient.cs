using Aydsko.iRacingData;
using Microsoft.Extensions.Configuration;

namespace Pitwall.Server.Core.iRacingData
{
    public class iRacingDataClient
    {
        private readonly IDataClient dataClient;
        private readonly iRacingDataRepository iRacingDataRepository;

        public iRacingDataClient(IDataClient dataClient, iRacingDataRepository iRacingDataRepository, IConfiguration configuration)
        {
            dataClient.UseUsernameAndPassword(configuration["iRacingUsername"], configuration["iRacingPassword"]);
            this.dataClient = dataClient;
            this.iRacingDataRepository = iRacingDataRepository;
        }

        public async Task<bool> UpdateData()
        {
            //If it has been more than 23 hours, allow an update (data is cached for 72 hours)
            if (await iRacingDataRepository.GetTtl() < TimeSpan.FromHours(49))
            {
                var cars = await dataClient.GetCarsAsync();
                await iRacingDataRepository.SetCars(cars.Data);

                var carClasses = await dataClient.GetCarClassesAsync();
                await iRacingDataRepository.SetCarClasses(carClasses.Data);

                var carAssetDetails = await dataClient.GetCarAssetDetailsAsync();
                await iRacingDataRepository.SetCarAssetDetails(carAssetDetails.Data);

                var tracks = await dataClient.GetTracksAsync();
                await iRacingDataRepository.SetTracks(tracks.Data);

                var trackAssets = await dataClient.GetTrackAssetsAsync();
                await iRacingDataRepository.SetTrackAssetDetails(trackAssets.Data);

                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
