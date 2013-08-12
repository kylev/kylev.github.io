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
    mcSorted = accounts.sort();

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
        mcOnline++;
        mcActive[user] = transformStream(data.stream);
        addToTable(user, mcActive[user]);
      }
    } else {
      if (mcActive[user] !== undefined) {
        mcOnline--;
        removeFromTable(user);
      }
      mcActive[user] = undefined;
    }

    $("div.updated span").text(new Date());
  }

  // Transform a stream response into something simpler
  function transformStream(so) {
    return {
      name: so.channel.name,
      game: so.game,
      viewers: so.viewers,
      display_name: so.channel.display_name,
      url: so.channel.url,
      status: so.channel.status
    };
  }

  function addToTable(user, data) {
    var link = "<a href='" + data.url + "'>" + mcList[user] + "</a>";
    var cells = "<td>" + [link, data.game, data.status, data.viewers].join("</td><td>") + "</td>";
    var row = $("<tr>", {"data-user": user}).append(cells);
    $("table.streamers").append(row);

    updateOtherData();
  }

  function removeFromTable(user) {
    console.log("removing " + user);
    $("table.streamers tr[data-user'" + user + "']").remove();

    updateOtherData();
  }

  function updateOtherData() {
    var offlineLinks = []
    for (var i = 0; i < mcSorted.length; i++) {
      if (mcActive[mcSorted[i]] === undefined) {
        offlineLinks.push("<a href='http://www.twitch.tv/" + mcSorted[i] + "'>" + mcList[mcSorted[i]] + "</a>");
      }
    }

    $("div.offline p").html(offlineLinks.join(", "))
    $("h2 span.counter").html(mcOnline);

    var title = "Mindcrack Livestreams"
    if (mcOnline > 0) {
      title = "(" + mcOnline + ") " + title;
    }
    document.title = title
  }
}(window.cwatch = window.cwatch || {}, jQuery));
