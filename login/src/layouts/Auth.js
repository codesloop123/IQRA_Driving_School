import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export default function Auth(props) {
  const { uid } = useSelector((state) => state.auth);
  const history = useHistory();
  useEffect(() => {
    if (uid) {
      history.push("/");
    }
  }, [uid]);
  return (
    <>
      {/* <Navbar transparent /> */}
      <main>
        <section className="relative w-full py-40 h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + require("assets/img/register_bg_2.png").default + ")",
            }}
          ></div>
          {props.children}
          {/* <FooterSmall absolute /> */}
        </section>
      </main>
    </>
  );
}
