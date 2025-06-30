import React, { useState, useEffect } from "react";
import { Hero } from "./Model/Hero";

export const Heroes = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const [heroName, setHeroName] = useState("");
  const [heroPower, setHeroPower] = useState("");
  const [heroPowerName, setHeroPowerName] = useState("");

  const handleOnClick = () => {
    const hero: Hero = {
      name: heroName,
      power: parseInt(heroPower, 10),
      powerName: heroPowerName,
    };
    setHeroes((prev) => [...prev, hero]);
    setHeroName("");
    setHeroPower("");
    setHeroPowerName("");
  };

  useEffect(() => {
    fetch("http://localhost:2727/heroes")
      .then((res) => res.json())
      .then((json) => {
        setHeroes(json);
      })
      .catch((error) => {
        console.log("Error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Hero name</label>
          <input
            onChange={(e) => {
              setHeroName(e.target.value);
            }}
            value={heroName}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Hero Power</label>
          <input
            onChange={(e) => {
              setHeroPower(e.target.value);
            }}
            value={heroPower}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Hero Power Name</label>
          <input
            onChange={(e) => {
              setHeroPowerName(e.target.value);
            }}
            value={heroPowerName}
          />
        </div>
        <button onClick={handleOnClick}>Submit</button>
      </div>

      <div style={{ textAlign: "left" }}>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          heroes.map((hero, index) => {
            return (
              <div style={{ marginBottom: "3rem" }}>
                <div key={index}>
                  <h4>Hero name: {hero.name}</h4>
                  <h4>Hero power: {hero.power}</h4>
                  <h4>Hero power Name: {hero.powerName}</h4>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
