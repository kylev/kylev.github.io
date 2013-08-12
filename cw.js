(function(cwatch, $, undefined) {

  var mcList = {
    'millbee': "Millbee",
    'mhykol': "Mykhol",
    'vintagebeef': "Vintage Beef",
    'nebris': "Nebris",
    'wcs_america': "Faker 1",
    'leveluplive': "Faker Mommy"
  };

  var mcActive = {};

  var pollTime = 5 * 60 * 1000;

  cwatch.init = function () {
    var accounts = []
    for (var key in mcList) {
      if (mcList.hasOwnProperty(key)) {
        accounts.push(key);
      }
    }

    $.each(accounts, function (index, item) {
      fetchTwitchInfo(item);
    });
  };

  cwatch.poke = function() {
    return mcActive;
  };

  function fetchTwitchInfo(user) {
    Twitch.api({method: 'streams/' + user}, function (error, data) { handleTwitchData(user, error, data); });
    setTimeout(function () { fetchTwitchInfo(user); }, pollTime);
  }

  function handleTwitchData(user, error, data) {
    if (error) {
      return;
    }

    var changed = false;
    if (data.stream) {
      if (mcActive[user] === undefined) {
        changed = true;
      }
      mcActive[user] = transformStream(data.stream);
    } else {
      if (mcActive[user] !== undefined) {
        changed = true;
      }
      mcActive[user] = undefined;
    }

    if (changed) {
      freshenHtml();
      console.log("It changed for " + user);      
    }
  }

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
  }

  function freshenHtml() {

  }
}(window.cwatch = window.cwatch || {}, jQuery));
