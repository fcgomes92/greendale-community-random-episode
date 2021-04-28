const cheerio = require("cheerio");
const axios = require("axios");
const { format, parse } = require("date-fns");
const fs = require("fs");

const baseURL = "https://www.themoviedb.org";
const buildEpisodeDetailsURL = (id) =>
  `https://www.themoviedb.org/tv/18347-community/remote/episode/${id}/expanded_info`;

async function getSeasonEpisodes(seasonNumber) {
  const url = `https://www.themoviedb.org/tv/18347-community/season/${seasonNumber}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  console.log(`Building Season ${seasonNumber}`);
  const episodes = await Promise.all(
    $(".card")
      .get()
      .map(async (_el, _idx) => {
        const idx = _idx + 1;
        const id = `S0${seasonNumber}E${idx > 9 ? "" : 0}${idx}`;
        console.log(`Building ${id}`);
        const card = $(_el).children().first();
        const _thumbnail = card.find("img").first().attr("src");
        const title = card.find("h3 a").first().text();
        const _date = card.find(".date").first().text().replace("  ", " ");
        const rating = card
          .find(".rating")
          .first()
          .text()
          .replace(/\n/g, "")
          .trim();
        const date = format(
          parse(_date, "LLLL d, yyyy", new Date()),
          "yyyy-MM-dd"
        );
        const episodeNumber = card.find(".episode_number").first().text();
        const url = `${baseURL}${card.find("h3 a").first().attr("href")}`;
        const thumbnail = `${baseURL}${_thumbnail}`;
        const externalId = card.attr("id").replace("episode_", "").trim();
        const detailsResponse = await axios.get(
          buildEpisodeDetailsURL(externalId)
        );
        const $details = cheerio.load(detailsResponse.data);
        const details = $details(".crew p")
          .get()
          .reduce((allDetails, _p) => {
            const p = $details(_p);
            const key = p
              .find("strong")
              .first()
              .text()
              .replace("by:", "")
              .trim()
              .toLowerCase();
            const value = p.find("a").first().text();
            return {
              ...allDetails,
              [key]: value,
            };
          }, {});
        return {
          id,
          title,
          season: seasonNumber,
          episode: Number(episodeNumber),
          date,
          url,
          rating: Number(rating),
          thumbnail,
          details,
        };
      })
  );
  return episodes;
}

(async function () {
  const seasons = [1, 2, 3, 4, 5, 6];
  const episodes = await Promise.all(seasons.map(getSeasonEpisodes));
  console.log("Done getting episodes");
  console.log("Saving episodes' list to ./episodes.json");
  fs.writeFileSync("./episodes.json", JSON.stringify(episodes), { flag: "w" });
  console.log("Done");
})();
