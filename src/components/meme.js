import React from "react";

const Meme = props => {
  return (
    <div className="meme">
      <div className="img-wrapper">
        <img className="meme-img" src={props.image} alt="funny meme" />
      </div>

      <p>{props.text}</p>

      {props.favorite ? (
        <img
          src="https://library.kissclipart.com/20180830/fuw/kissclipart-twinkle-little-star-clip-art-clipart-twinkle-twin-0d72b7a5dc286d1e.jpg"
          alt="star"
        />
      ) : null}
      <button onClick={() => props.deleteMeme(props.id)}>DEL</button>
      <button onClick={() => props.editMeme(props.id)}>EDIT</button>
    </div>
  );
};

export default Meme;
