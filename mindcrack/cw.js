(function(cwatch, $, undefined) {

  var mcList = {
    "anderzel": "AnderZEL",
    "adlingtontplays": "Adlington",
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
    "paulsoaresjr": "PaulSoaresJr",
    "pauseunpause": "Pause",
    "pyropuncher": "Pyrao",
    "shreeyamnet": "Shree",
    "thejimslp": "TheJims",
    "vintagebeef": "Vintage Beef",
    "zisteau": "Zisteau"
  };

  var mcSorted = [];
  var mcActive = {};

  var pollTime = 5 * 60 * 1000;

  cwatch.init = function () {
    for (var key in mcList) {
      if (mcList.hasOwnProperty(key)) {
        mcSorted.push(key);
      }
    }
    mcSorted.sort();

    updateOtherData(); // Pre-fill other data
    fetchAllTwitchInfo();
  };

  function fetchAllTwitchInfo() {
    $.each(mcSorted, function (index, item) {
      fetchTwitchInfo(item);
    });

    setTimeout(function () { fetchAllTwitchInfo(); }, pollTime);
    _gaq.push(['_trackEvent', 'Automated', 'FetchTwitchTV']);
  }

  function fetchTwitchInfo(user) {
    Twitch.api({method: 'streams/' + user}, function (error, data) { handleTwitchData(user, error, data); });
  }

  function handleTwitchData(user, error, data) {
    if (error) {
      _gaq.push(['_trackEvent', 'Automated', 'FetchTwitchTVError', error.message]);
      return;
    }

    var changed = false;
    if (data.stream) {
      var joined = mcActive[user] === undefined;
      mcActive[user] = transformStream(data.stream);

      if (joined) {
        addToTable(user, mcActive[user]);
      } else {
        freshenRow(user, mcActive[user]);
      }
    } else {
      if (mcActive[user] !== undefined) {
        mcActive[user] = undefined;
        removeFromTable(user);
      }
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
    $("table.streamers").append(streamerHtmlRow(user, data));

    updateOtherData();
  }

  function freshenRow(user, data) {
    $("table.streamers tr[data-user='" + user + "']").replaceWith(streamerHtmlRow(user, data));
  }

  function streamerHtmlRow(user, data) {
    var link = "<a href='" + data.url + "'>" + mcList[user] + "</a>";
    var cells = "<td>" + [link, data.game, data.status, data.viewers].join("</td><td>") + "</td>";
    return $("<tr>", {"data-user": user}).append(cells);
  }

  function removeFromTable(user) {
    $("table.streamers tr[data-user='" + user + "']").remove();

    updateOtherData();
  }

  function updateOtherData() {
    var offlineLinks = []
    var mcOnline = 0;
    for (var i = 0; i < mcSorted.length; i++) {
      if (mcActive[mcSorted[i]] === undefined) {
        offlineLinks.push("<a href='http://www.twitch.tv/" + mcSorted[i] + "'>" + mcList[mcSorted[i]] + "</a>");
      } else {
        mcOnline++;
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
