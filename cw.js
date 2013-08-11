(function(cwatch, $, undefined) {

  var mclist = {
    'millbee': "Millbee",
    'mhykol': "Mykhol",
    'vintagebeef': "Vintage Beef",
    'nebris': "Nebris",
    'wcs_america': "Faker 1",
    'dota2ti': "Faker Mommy"
  };

  var mcers = (function (obj) {
      var keys = []
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
      }
      return keys;
  })(mclist).sort();

  var active = {};

  cwatch.updateTable = function () {
    mcers.forEach (function (user) {
      console.log(user);
      twichInfoForUser(user, console.log);
    });
  };

  // Transform a stream response into something simpler
  function transformStream(so) {
    return {
      name: so.name,
      game: so.game,
      viewers: so.viewers,
      display_name: so.channel.display_name,
      url: so.channel.url,
      status: so.channel.status
    };
  };

  function twichInfoForUser(user, cb) {
    Twitch.api({method: 'streams/' + user},
      function (error, data) {
        if (error) {
          console.log(user + " stream fetch error: " + error);
          return;
        }

        if (data.stream) {
          console.log(transformStream(data.stream));
        } else {
          console.log(user + " is not active");
        }

      }
    );
  };

}(window.cwatch = window.cwatch || {}, jQuery));
