import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home";
import FilesList from "../pages/home/filesList";

const MainRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/files" element={<FilesList />} />
      </Routes>
    </>
  );
};

export default MainRoute;
