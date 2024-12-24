"use client";

import React from "react";
import CreatePoll from "../components/CreatePoll";
import ViewPolls from "../components/ViewPolls";
import Vote from "../components/Vote";

const Home = () => (
  <div>
    <CreatePoll />
    <Vote />
    <ViewPolls />
  </div>
);

export default Home;
