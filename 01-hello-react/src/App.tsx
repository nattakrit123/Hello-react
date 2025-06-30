import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Hi } from "./Hi";
import { Heroes } from "./Heroes";
import { Hero } from "./Model/Hero";

function App() {
  return (
    <>
      <div className="App">
        <Heroes />
      </div>
    </>
  );
}

export default App;
