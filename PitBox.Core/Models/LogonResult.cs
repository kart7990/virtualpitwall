using Newtonsoft.Json;

namespace PitBox.Core.Models
{
    public class LogonResult
    {

        public LogonResult(JsonWebToken jwt)
        {
            Jwt = jwt;
        }

        public LogonResult(bool requiresRegistration, string email)
        {
            RequiresRegistration = requiresRegistration;
            ExternalEmail = email;
        }

        public LogonResult(string errorMessage, bool lockedOut = false, bool notAllowed = false, bool requiresTwoFactor = false)
        {
            IsLockedOut = lockedOut;
            IsNotAllowed = notAllowed;
            RequiresTwoFactor = requiresTwoFactor;
            ErrorMessage = errorMessage;
        }

        public bool Succeeded { get { return Jwt != null; } }
        [JsonIgnore]
        public JsonWebToken Jwt { get; private set; }
        public bool IsLockedOut { get; }
        public bool IsNotAllowed { get; }
        public bool RequiresTwoFactor { get; }
        public bool RequiresRegistration { get; }
        public string ErrorMessage { get; }
        [JsonIgnore]
        public string ExternalEmail { get; }
    }
}
