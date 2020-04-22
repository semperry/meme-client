import React from "react";
import DropzoneComponent from "react-dropzone-component";
import request from "superagent";
import axios from "axios";
import { navigate } from "hookrouter";

import "../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../node_modules/dropzone/dist/min/dropzone.min.css";

const MemeForm = props => {
  const [input, setInput] = React.useState("");
  const [favorite, setFavorite] = React.useState(false);
  const [image, setImage] = React.useState("");
  const imageRef = React.useRef(null);

  React.useEffect(() => {
    if (props.id && props.editMode) {
      fetch(`http://localhost:5000/meme/${props.id}`)
        .then(response => response.json())
        .then(data => {
          setInput(data.text);
          setFavorite(data.favorite);
        });
    }
  }, []);

  const componentConfig = () => {
    return {
      iconFiletypes: [".jpg", ".png"],
      showFiletypeIcon: true,
      postUrl: "https://httpbin.org/post"
    };
  };

  const handleDrop = () => {
    return {
      addedfile: file => {
        let upload = request
          .post("https://api.cloudinary.com/v1_1/semper-ry/image/upload")
          .field("upload_preset", "meme-images")
          .field("file", file);

        upload.end((err, res) => {
          if (err) {
            console.log("Cloudinary error: ", err);
          }
          if (res.body.secure_url !== "") {
            setImage(res.body.secure_url);
          }
        });
      }
    };
  };

  const djsConfig = () => {
    return {
      addRemoveLinks: true,
      maxFiles: 1
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (props.editMode) {
      await fetch(`http://localhost:5000/meme/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          text: input,
          favorite: favorite
        })
      })
        .then(imageRef.current.dropzone.removeAllFiles())
        .catch(err => console.log("put error: ", err));
    } else {
      await axios
        .post("http://localhost:5000/add-meme", {
          text: input,
          image: image,
          favorite: favorite
        })
        .then(() => {
          setInput("");
          setImage("");
          setFavorite(false);
          imageRef.current.dropzone.removeAllFiles();
        })
        .then(navigate("/"))
        .catch(err => {
          console.log("form submit: ", err);
        });
    }
  };

  return (
    <div>
      <h1>Add a Meme</h1>
      <form onSubmit={handleSubmit}>
        <DropzoneComponent
          ref={imageRef}
          config={componentConfig()}
          djsConfig={djsConfig()}
          eventHandlers={handleDrop()}
        >
          Drop Yo' Meme
        </DropzoneComponent>
        <input
          type="text"
          placeholder="Caption"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div>
          <input
            type="checkbox"
            checked={favorite}
            onChange={() => setFavorite(!favorite)}
          />
          <span>Favorite?</span>
        </div>
        <button type="submit">Post Meme</button>
      </form>
    </div>
  );
};

export default MemeForm;
