import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import localforage from "localforage";

const IframeContainer = () => {
  const { index } = useParams();
  const [powerBiUrls, setPowerBiUrls] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      const token = await localforage.getItem("token");
      const userId = await localforage.getItem("ID");

      if (!token || !userId) {
        console.error("Token or user ID is null or undefined");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/biUrls/get-dashboards/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPowerBiUrls(response.data);
        console.log('response.data::: ', response.data);
      } catch (error) {
        console.error(
          "Error fetching Power BI URLs:",
          error.response?.data?.message || "Unknown error"
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: "100vh" }} id="root">
      {index !== undefined && powerBiUrls[index] !== undefined && (
        <iframe
          src={powerBiUrls[index].url}
          title={`Power BI Report ${parseInt(index) + 1}`}
          width="100%"
          height="100%"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default IframeContainer;
