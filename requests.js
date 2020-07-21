const fetch = require("node-fetch");

module.exports = {
  getSurvey: () =>
    fetch("https://wiz.medone.idf.il/mk/m/6u6dnt6a4e", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9,he;q=0.8",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors",
    }),
  getCaptcha: (cookie) =>
    fetch("https://wiz.medone.idf.il/mk/captcha.aspx", {
      headers: {
        accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9,he;q=0.8",
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "same-origin",
        cookie,
      },
      referrer: "https://wiz.medone.idf.il/mk/m/6u6dnt6a4e",
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors",
    }),
  submitSurvey: (cookie, captchaSolution, tz) => {
    const date = new Date();
    const dateStr = getDateStr(date);
    const timeStr = getTimeStr(date);
    return fetch("https://wiz.medone.idf.il/mk/forms/formgen.aspx/saveForm", {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,he;q=0.8",
        "content-type": "application/json; charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie,
      },
      referrer: "https://wiz.medone.idf.il/mk/m/6u6dnt6a4e",
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"formid":"cdd546f4-372a-4c62-a391-6fd53686d36e","auth":"","data":"&capa3419=${captchaSolution}&timeStamp3417=${timeStr}&date3418=${dateStr}&txt3414=${tz}&sel3416=%u05DC%u05D0&sel3420=&date3421=&sel3422=&sel3423=&sel3424=&sel3425=&txt3427=&sel3428=&sel3430=&sel3432=&sel3434=&sel3436=&sel3438=&sel3439=&sel3440=&sel3441=&sel3442=&olmwizdata=oLs0ZAN0YXDb7ymDeCHRPLUSjbQQ==&files=","hasFiles":0,"TempDocument":"","captcha":""}`,
      method: "POST",
      mode: "cors",
    });
  },
};

function getDateStr(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  return `${day}/${month}/${year}`;
}

function getTimeStr(date) {
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (hour < 10) {
    hour = "0" + minutes;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${hour}%3A${minutes}%3A${seconds}`;
}
