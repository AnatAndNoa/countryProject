using countryProj.BL;
using Microsoft.AspNetCore.Mvc;

namespace countryProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        // POST: api/Friends
        // הוספת חבר לפי אימייל
        [HttpPost]
        public int Post(
            [FromBody] Friendship friendship)
        {
            return friendship.Add();
        }

        // GET: api/Friends/5
        // קבלת כל החברים של משתמש
        [HttpGet("{userId}")]
        public IEnumerable<Friendship>
            GetFriends(int userId)
        {
            Friendship friendship =
                new Friendship();

            friendship.UserId = userId;

            return friendship.ReadFriends();
        }

        // GET:
        // api/Friends/5/8/visited
        // משתמש 5 מבקש לראות
        // את המדינות של חבר 8
        [HttpGet(
            "{viewerUserId}/{friendUserId}/visited"
        )]
        public IEnumerable<UserCountry>
            GetFriendVisitedCountries(
                int viewerUserId,
                int friendUserId)
        {
            Friendship friendship =
                new Friendship();

            friendship.UserId =
                viewerUserId;

            friendship.FriendUserId =
                friendUserId;

            return friendship
                .ReadFriendVisitedCountries();
        }

        // GET:
        // api/Friends/5/8/shares/ISR
        // משתמש 5 מבקש את השיתופים
        // של חבר 8 על מדינת ISR
        [HttpGet(
            "{viewerUserId}/{friendUserId}/shares/{countryCode}"
        )]
        public IEnumerable<CountryShare>
            GetFriendCountryShares(
                int viewerUserId,
                int friendUserId,
                string countryCode)
        {
            Friendship friendship =
                new Friendship();

            friendship.UserId =
                viewerUserId;

            friendship.FriendUserId =
                friendUserId;

            return friendship
                .ReadFriendCountryShares(
                    countryCode
                );
        }
    }
}