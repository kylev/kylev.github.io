var CW = {};

CW.mclist = {
  'millbee': "Millbee",
  'mhykol': "Mykhol",
  'vintagebeef': "Vintage Beef",
  'nebris': "Nebris",
  'wcs_america': "Faker 1",
  'dota2ti': "Faker Mommy"
};

CW.mcers = (function (obj) {
  var keys = []
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        keys.push(key);
    }
  }
  return keys;
})(CW.mclist).sort();

CW.active = {}

CW.setupTable = function (tbody_selector) {
  this.mcers.forEach(function (user) {
    console.log("Setup" + user);
    $(tbody_selector).append("<tr><td>" + user + "</td></tr>");
  });
  $("h2 span.counter").html(0);
};

CW.updateTable = function () {
  this.mcers.forEach (function (user) {
    console.log(user);
    CW.twichStreamForUser(user);
  });
};

CW.twichStreamForUser = function(user) {
  Twitch.api({method: 'streams/' + user},
    function (error, data) {
      if (error) {
        console.log(user + " stream fetch error:" + error);
        return;
      }

      if (data.stream) {
        console.log(CW.transformStream(data.stream));
      } else {
        console.log(user + " is not active");
      }

    }
  );
};

// Transform a stream response into something simpler
CW.transformStream = function (so) {
  if (!so) return {};
  return {
    name: so.name,
    game: so.game,
    viewers: so.viewers,
    display_name: so.channel.display_name,
    url: so.channel.url,
    status: so.channel.status
  };
};
