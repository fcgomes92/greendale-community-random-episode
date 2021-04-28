import { getRandomEpisode } from "@/lib/episodes";
import classNames from "classnames";
import React from "react";
import Style from "../style.module.scss";

const Wheel = ({ loading = false }) => {
  const className = classNames(Style.wheel, {
    [Style["wheel--rotate"]]: loading,
  });
  return <div className={className} />;
};

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const [episode, setEpisode] = React.useState();
  const handleGetNewEpisode = () => {
    setEpisode(undefined);
    setLoading(true);
    setTimeout(() => {
      setEpisode(getRandomEpisode());
      setLoading(false);
    }, 4000);
  };
  return (
    <>
      <div className={Style.title}>Community Random Episode</div>
      <div className={Style.subtitle}>
        All information provided by:
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Movie DB
        </a>
      </div>
      <div className={Style.action}>
        <button
          disabled={loading}
          className={Style.action__button}
          onClick={handleGetNewEpisode}
        >
          Get new episode
        </button>
      </div>
      <div className={Style.animation}>
        <Wheel loading={loading} />
      </div>
      {episode && (
        <div className={Style.card}>
          <div className={Style.card__id}>{episode.id}</div>
          <div className={Style.card__title}>{episode.title}</div>
          <div className={Style.card__date}>{episode.date}</div>
          <img
            className={Style.card__image}
            src={episode.thumbnail}
            loading="lazy"
            alt={episode.title}
          />
          <div className={Style.card__rating}>
            <strong>{episode.rating}</strong>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
