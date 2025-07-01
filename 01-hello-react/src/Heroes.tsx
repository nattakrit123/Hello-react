import React, { useState, useEffect } from "react";
import { Hero } from "./Model/Hero";

export const Heroes = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isEditing, setEditing] = useState<boolean>(false);

  const [heroName, setHeroName] = useState("");
  const [heroPower, setHeroPower] = useState("");
  const [heroPowerName, setHeroPowerName] = useState("");

  const handleOnClick = () => {
    if (!heroName || !heroPower || !heroPowerName) {
      alert("Please fill all fields");
      return;
    }
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
            type="number"
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
        <div>
          <button
            onClick={() => {
              setEditing(!isEditing);
            }}
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      <div style={{ textAlign: "left" }}>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          heroes.map((hero, index) => {
            return (
              <div>
                <div style={{ marginBottom: "3rem" }}>
                  <div key={index}>
                    {isEditing ? (
                      <div>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <h4>Hero name: </h4>
                          <input
                            type="text"
                            placeholder="Hero name"
                            value={hero.name}
                            onChange={(e) => {
                              const updatedHeroes = [...heroes];
                              updatedHeroes[index].name = e.target.value;
                              setHeroes(updatedHeroes);
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <h4>Hero power: </h4>
                          <input
                            type="number"
                            placeholder="Hero power"
                            value={hero.power}
                            onChange={(e) => {
                              const updatedHeroes = [...heroes];
                              updatedHeroes[index].power = parseInt(
                                e.target.value,
                                10
                              );
                              setHeroes(updatedHeroes);
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <h4>Hero power Name: </h4>
                          <input
                            type="text"
                            placeholder="Hero power name"
                            value={hero.powerName}
                            onChange={(e) => {
                              const updatedHeroes = [...heroes];
                              updatedHeroes[index].powerName = e.target.value;
                              setHeroes(updatedHeroes);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4>Hero name: {hero.name}</h4>
                        <h4>Hero power: {hero.power}</h4>
                        <h4>Hero power Name: {hero.powerName}</h4>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
