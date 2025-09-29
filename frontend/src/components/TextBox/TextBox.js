import React from "react";
import "./TextBox.css"; // CSS 별도 분리

function TextBox() {
  return (
    <section className="mainTextBox">
      <div className="mainText">
        <p>runner's mecca</p>
        <p>On Your Mark</p>
      </div>
      <div className="textBottom">
        <p>
          “Running” is the fastest action that humans can perform and is the basic activity of all sports.
        </p>
        <p>
          We want to make running not just a trend, but a sport and culture that everyone can enjoy.
        </p>
      </div>
    </section>
  );
}

export default TextBox;
