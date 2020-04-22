import React from "react";
import axios from "axios";
import Meme from "./meme";
import { navigate } from "hookrouter";

const App = () => {
  const [memes, setMemes] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      let result = await fetch("http://localhost:5000/memes")
        .then(res => res.json())
        .then(data => setMemes(data))
        .catch(err => console.log(err));
    };
    fetchData();
  }, []);

  const deleteMeme = id => {
    axios
      .delete(`http://localhost:5000/meme/${id}`)
      .then(setMemes(memes.filter(meme => meme.id !== id)))
      .catch(err => console.log("delete err", err));
  };

  const editMeme = id => {
    navigate(`/form/${id}`);
  };

  const renderMemes = () => {
    return memes.map(meme => {
      return (
        <Meme
          key={meme.id}
          id={meme.id}
          text={meme.text}
          image={meme.image}
          favorite={meme.favorite}
          deleteMeme={deleteMeme}
          editMeme={editMeme}
        />
      );
    });
  };
  return <div className="app">{renderMemes()}</div>;
};

export default App;
