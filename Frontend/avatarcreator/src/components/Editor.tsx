import React, { useState, useEffect } from "react";
import { decodeAvatar } from "./AvatarDecoder";
import DisplayAvatar from "./DisplayAvatar";

const Editor: React.FC = () => {
  const [config, setConfig] = useState<any>(null);

  const [eyeShape, setEyeShape] = useState<number>(1);
  const [eyeColor, setEyeColor] = useState<number>(1);
  const [faceShape, setFaceShape] = useState<number>(1);
  const [faceColor, setFaceColor] = useState<number>(1);
  const [hairShape, setHairShape] = useState<number>(1);
  const [hairColor, setHairColor] = useState<number>(1);
  const [mouthShape, setMouthShape] = useState<number>(1);
  const [mouthColor, setMouthColor] = useState<number>(1); // New state for mouth color

  const [decodedAvatar, setDecodedAvatar] = useState<any>(null);

  // Fetch the configuration from the JSON file
  useEffect(() => {
    fetch("/avatarConfig.json")
      .then((response) => response.json())
      .then((data) => setConfig(data))
      .catch((error) => console.error("Error loading config:", error));
  }, []);

  // Function to encode the current state of the avatar
  const encodeAvatar = (): string => {
    return `${eyeShape}-${eyeColor}_${faceShape}-${faceColor}_${hairShape}-${hairColor}_${mouthShape}-${mouthColor}`; // Update encoding with mouthColor
  };

  // Decode the avatar whenever changes happen
  useEffect(() => {
    if (config) {
      const encodedAvatar = encodeAvatar();
      const decoded = decodeAvatar(encodedAvatar, config);
      setDecodedAvatar(decoded); // Set the decoded avatar for display
    }
  }, [
    eyeShape,
    eyeColor,
    faceShape,
    faceColor,
    hairShape,
    hairColor,
    mouthShape,
    mouthColor, // Add mouth color to dependency list
    config,
  ]);

  // Function to handle random selection for each dropdown
  const handleRandomize = () => {
    const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
    setEyeShape(getRandomInt(config.eyes.length));
    setEyeColor(getRandomInt(config.eyeColors.length));
    setFaceShape(getRandomInt(config.faces.length));
    setFaceColor(getRandomInt(config.faceColors.length));
    setHairShape(getRandomInt(config.hair.length));
    setHairColor(getRandomInt(config.hairColors.length));
    setMouthShape(getRandomInt(config.mouth.length));
    setMouthColor(getRandomInt(config.mouthColors.length));
  };

  const handleSave = () => {
    const encodedAvatar = encodeAvatar();
    console.log("Saved Avatar String: ", encodedAvatar);
  };

  // Show loading state while config is not yet loaded
  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Avatar Editor</h2>

      {/* Eye Shape */}
      <label>Eye Shape:</label>
      <select onChange={(e) => setEyeShape(Number(e.target.value))}>
        {config.eyes.map((shape: any) => (
          <option key={shape.id} value={shape.id}>
            {shape.label}
          </option>
        ))}
      </select>

      {/* Eye Color */}
      <label>Eye Color:</label>
      <select onChange={(e) => setEyeColor(Number(e.target.value))}>
        {config.eyeColors.map((color: any) => (
          <option key={color.id} value={color.id}>
            {color.label}
          </option>
        ))}
      </select>

      {/* Face Shape */}
      <label>Face Shape:</label>
      <select onChange={(e) => setFaceShape(Number(e.target.value))}>
        {config.faces.map((shape: any) => (
          <option key={shape.id} value={shape.id}>
            {shape.label}
          </option>
        ))}
      </select>

      {/* Face Color */}
      <label>Face Color:</label>
      <select onChange={(e) => setFaceColor(Number(e.target.value))}>
        {config.faceColors.map((color: any) => (
          <option key={color.id} value={color.id}>
            {color.label}
          </option>
        ))}
      </select>

      {/* Hair Shape */}
      <label>Hair Shape:</label>
      <select onChange={(e) => setHairShape(Number(e.target.value))}>
        {config.hair.map((shape: any) => (
          <option key={shape.id} value={shape.id}>
            {shape.label}
          </option>
        ))}
      </select>

      {/* Hair Color */}
      <label>Hair Color:</label>
      <select onChange={(e) => setHairColor(Number(e.target.value))}>
        {config.hairColors.map((color: any) => (
          <option key={color.id} value={color.id}>
            {color.label}
          </option>
        ))}
      </select>

      {/* Mouth Shape */}
      <label>Mouth Shape:</label>
      <select onChange={(e) => setMouthShape(Number(e.target.value))}>
        {config.mouth.map((shape: any) => (
          <option key={shape.id} value={shape.id}>
            {shape.label}
          </option>
        ))}
      </select>

      {/* Mouth Color */}
      <label>Mouth Color:</label>
      <select onChange={(e) => setMouthColor(Number(e.target.value))}>
        {config.mouthColors.map((color: any) => (
          <option key={color.id} value={color.id}>
            {color.label}
          </option>
        ))}
      </select>

      {/* Live Preview of the Avatar */}
      <h3>Live Avatar Preview</h3>
      {decodedAvatar && <DisplayAvatar avatarElements={decodedAvatar} />}

      {/* Save Button */}
      <button onClick={handleSave}>Save Avatar</button>

      {/* Randomize Button */}
      <button onClick={handleRandomize}>Randomize Avatar</button>
    </div>
  );
};

export default Editor;
