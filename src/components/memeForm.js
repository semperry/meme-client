import React, { useState, useEffect, useRef } from "react";
import { navigate } from "hookrouter";
import axios from "axios";
import DropzoneComponent from "react-dropzone-component";

import "../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../node_modules/dropzone/dist/min/dropzone.min.css";

const MemeForm = (props) => {
	const [text, setText] = useState("");
	const [favorite, setFavorite] = useState(false);
	const [image, setImage] = useState("");
	const imageRef = useRef(null);

	const componentConfig = () => {
		return {
			iconFiletypes: [".jpg", ".png"],
			showFiletypeIcon: true,
			postUrl: "https://httpbin.org/post",
		};
	};

	const djsConfig = () => {
		return {
			addRemoveLinks: true,
			maxFiles: 1,
		};
	};

	const handleDrop = () => {
		return {
			addedfile: (file) => {
				const formData = new FormData();

				formData.append("upload_preset", "meme-images");
				formData.append("file", file);

				fetch("https://api.cloudinary.com/v1_1/semper-ry/image/upload", {
					method: "POST",
					body: formData,
				})
					.then((res) => res.json())
					.then((data) => {
						setImage(data.secure_url);
					})
					.catch((err) => console.error(err));
			},
		};
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		switch (!props.id) {
			case false:
				await fetch(`https://rec-meme-flask.herokuapp.com/meme/${props.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						text,
						favorite,
					}),
				})
					.then(() => imageRef.current.dropzone.removeAllFiles())
					.then(() => navigate("/"))
					.catch((err) => console.error("PUT Error: ", err));
				break;
			default:
				await axios
					.post("https://rec-meme-flask.herokuapp.com/add-meme", {
						text,
						favorite,
						image,
					})
					.then(() => {
						setText("");
						setImage("");
						setFavorite(false);
						imageRef.current.dropzone.removeAllFiles();
					})
					.then(() => navigate("/"))
					.catch((err) => console.error("Handle Submit Error: ", err));
		}
	};

	useEffect(() => {
		if (props.id) {
			fetch(`https://rec-meme-flask.herokuapp.com/meme/${props.id}`)
				.then((res) => res.json())
				.then((data) => {
					setText(data.text);
					setFavorite(data.favorite);
				});
		}
	}, []);

	return (
		<div>
			<h1>{props.id ? "Edit Meme" : "Add a Meme"}</h1>
			<form onSubmit={handleSubmit}>
				<DropzoneComponent
					ref={imageRef}
					config={componentConfig()}
					djsConig={djsConfig()}
					eventHandlers={handleDrop()}
				>
					Drop that sweet meme yo
				</DropzoneComponent>
				<input
					type="text"
					placeholder="Caption"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<div>
					<input
						type="checkbox"
						checked={favorite}
						onChange={() => setFavorite(!favorite)}
					/>
					<span>Favorite?</span>
				</div>
				<button type="submit">{props.id ? "Update Meme" : "Post Meme"}</button>
			</form>
		</div>
	);
};

export default MemeForm;
