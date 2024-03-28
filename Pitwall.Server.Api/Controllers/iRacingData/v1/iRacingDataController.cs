using Asp.Versioning;
using Aydsko.iRacingData.Cars;
using Aydsko.iRacingData.Tracks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pitwall.Server.Core.iRacingData;
using Track = Aydsko.iRacingData.Tracks.Track;

namespace Pitwall.Server.Api.Controllers.iRacingData.v1
{
    [Produces("application/json")]
    [ApiVersion(1.0)]
    [ApiController]
    [Route("v{version:apiVersion}/iracing/data")]
    public class iRacingDataController : Controller
    {
        private readonly iRacingDataClient iRacingDataClient;
        private readonly iRacingDataRepository iRacingDataRepository;

        public iRacingDataController(iRacingDataClient iRacingDataClient, iRacingDataRepository iRacingDataRepository)
        {
            this.iRacingDataClient = iRacingDataClient;
            this.iRacingDataRepository = iRacingDataRepository;
        }

        [HttpGet("cars", Name = "GetCars")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(CarInfo[]), 200)]
        public async Task<IActionResult> GetCars()
        {
            await UpdateData();
            var cars = await iRacingDataRepository.GetCars();

            return Ok(cars);
        }

        [HttpGet("cars/{carId}", Name = "GetCar")]
        [ProducesResponseType(typeof(CarInfo), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetCar(int carId)
        {
            await UpdateData();
            var car = (await iRacingDataRepository.GetCars()).SingleOrDefault(c => c.CarId == carId);

            if (car != null)
            {
                return Ok(car);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("carClasses", Name = "GetCarClasses")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(Aydsko.iRacingData.Common.CarClass[]), 200)]
        public async Task<IActionResult> GetCarClasses()
        {
            await UpdateData();
            var carClasses = await iRacingDataRepository.GetCarClasses();

            return Ok(carClasses);
        }

        [HttpGet("carClasses/{carClassId}", Name = "GetCarClass")]
        [ProducesResponseType(typeof(Aydsko.iRacingData.Common.CarClass), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetCarClass(int carClassId)
        {
            await UpdateData();
            var carClass = (await iRacingDataRepository.GetCarClasses()).SingleOrDefault(c => c.CarClassId == carClassId);

            if (carClass != null)
            {
                return Ok(carClass);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("carAssets", Name = "GetCarsAssets")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(IReadOnlyDictionary<string, CarAssetDetail>), 200)]
        public async Task<IActionResult> GetCarAssets()
        {
            await UpdateData();
            var carAssets = await iRacingDataRepository.GetCarAssetDetails();

            return Ok(carAssets);
        }



        [HttpGet("carAssets/{carId}", Name = "GetCarAssets")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(CarAssetDetail), 200)]
        public async Task<IActionResult> GetCarAssets(int carId)
        {
            await UpdateData();
            var carAssets = await iRacingDataRepository.GetCarAssetDetails();

            if (carAssets.ContainsKey(carId.ToString()))
            {
                return Ok(carAssets[carId.ToString()]);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("tracks", Name = "GetTracks")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(Track[]), 200)]
        public async Task<IActionResult> GetTracks()
        {
            await UpdateData();
            var tracks = await iRacingDataRepository.GetTracks();

            return Ok(tracks);
        }

        [HttpGet("tracks/{trackId}", Name = "GetTrack")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(Track), 200)]
        public async Task<IActionResult> GetTrack(int trackId)
        {
            await UpdateData();
            var track = (await iRacingDataRepository.GetTracks()).SingleOrDefault(t => t.TrackId == trackId);

            if (track != null)
            {
                return Ok(track);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("trackAssets", Name = "GetTracksAssets")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(IReadOnlyDictionary<string, TrackAssets>), 200)]
        public async Task<IActionResult> GetTrackAssets()
        {
            await UpdateData();
            var trackAssets = await iRacingDataRepository.GetTrackAssetDetails();

            return Ok(trackAssets);
        }

        [HttpGet("trackAssets/{trackId}", Name = "GetTrackAssets")]
        [ResponseCache(Duration = 86400)]
        [ProducesResponseType(typeof(TrackAssets), 200)]
        public async Task<IActionResult> GetTrackAssets(int trackId)
        {
            await UpdateData();
            var trackAssets = await iRacingDataRepository.GetTrackAssetDetails();

            if (trackAssets.ContainsKey(trackId.ToString()))
            {
                return Ok(trackAssets[trackId.ToString()]);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("update")]
        [ProducesResponseType(200)]
        [ProducesResponseType(202)]
        [ProducesResponseType(400)]
        [AllowAnonymous]
        public async Task<IActionResult> Post()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await iRacingDataClient.UpdateData();

            if (updated)
            {
                return Accepted();
            }

            return Ok();
        }

        private async Task UpdateData()
        {
            await iRacingDataClient.UpdateData();
        }

    }
}
