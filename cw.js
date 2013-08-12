(function(cwatch, $, undefined) {

  var mcList = {
    "anderzel": "AnderZEL",
    "mc_arkas": "Arkas",
    "avidyazen": "Avidya",
    "w92baj": "Baj",
    "bdoubleo": "BdoubleO",
    "blamethecontroller": "BlameTC",
    "denialtv": "BlameTC (DenialTV)",
    "docm77live": "Docm",
    "ethotv": "Etho",
    "generikb": "GenerikB",
    "guude": "Guude",
    "jsano19": "Jsano",
    "kurtjmac": "Kurt",
    "supermcgamer": "MCGamer",
    "millbee": "Millbee",
    "mhykol": "Mhykol",
    "nebris": "Nebris",
    "pakratt0013": "Pakratt",
    "pauseunpause": "Pause",
    "pyropuncher": "Pyrao",
    "shreeyamnet": "Shree",
    "thejimslp": "TheJims",
    "vintagebeef": "Vintage Beef",
    "zisteau": "Zisteau",

    'straymav': "Faker 1",
    'leveluplive': "Faker Mommy",
    'finestko': "Another",
    'pandaxgaming': "Yet Again",
    'prod1gyx': "Blah",
    'scarletr0se': "Scarlet Rose"
  };

  var mcSorted = [];
  var mcActive = {};
  var mcOnline = 0;

  var pollTime = 15 * 1000;

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
