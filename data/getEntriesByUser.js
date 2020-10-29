const Airtable = require("airtable");
const fetch = require("node-fetch");
const keys = require("../keys");

function getEntriesByUser(username) {
  const url = `https://api.airtable.com/v0/${
    keys.airtable_base_data
  }/Messages?api_key=${
    keys.airtable_api_key
  }&filterByFormula=AND(Username%3D"${encodeURIComponent(username)}", IS_SAME(Timestamp, TODAY(), 'day'))`;
  //console.log(`FULL PATH ${url}`);
  const options = { method: "GET" };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => r.records);
}



module.exports = getEntriesByUser;
