import React, { useEffect } from "react";
import HomeMain from "../component/home/HomeMain";

function Home() {
  useEffect(() => {
    const scriptId = "dialogflow-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  // Chỉ chạy một lần khi component được mount

  return (
    <>
      <HomeMain />
      <df-messenger
        intent="WELCOME"
        chat-title="DGDShop_Ai_Chat_Vi"
        agent-id="0ee14268-f975-4e87-9d7c-8b4b761196d8"
        language-code="vi"
      ></df-messenger>
    </>
  );
}

export default Home;
