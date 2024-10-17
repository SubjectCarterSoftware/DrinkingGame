// AvatarDecoder.tsx
export const decodeAvatar = (encodedString: string, config: any) => {
  const [eyeData, faceData, hairData, mouthData] = encodedString.split("_");

  const [eyeShapeId, eyeColorId] = eyeData.split("-").map(Number);
  const [faceShapeId, faceColorId] = faceData.split("-").map(Number);
  const [hairShapeId, hairColorId] = hairData.split("-").map(Number);
  const [mouthShapeId, mouthColorId] = mouthData.split("-").map(Number); // Decode mouth color

  // Get elements from config
  const eyeShape = config.eyes.find((eye: any) => eye.id === eyeShapeId);
  const eyeColor = config.eyeColors.find(
    (color: any) => color.id === eyeColorId
  ).color;

  const faceShape = config.faces.find((face: any) => face.id === faceShapeId);
  const faceColor = config.faceColors.find(
    (color: any) => color.id === faceColorId
  ).color;

  const hairShape = config.hair.find((hair: any) => hair.id === hairShapeId);
  const hairColor = config.hairColors.find(
    (color: any) => color.id === hairColorId
  ).color;

  const mouthShape = config.mouth.find(
    (mouth: any) => mouth.id === mouthShapeId
  );
  const mouthColor = config.mouthColors.find(
    (color: any) => color.id === mouthColorId
  ).color; // Get mouth color

  return {
    faceElement: <FaceElement shape={faceShape} color={faceColor} />,
    eyesElement: <EyesElement shape={eyeShape} color={eyeColor} />,
    hairElement: <HairElement shape={hairShape} color={hairColor} />,
    mouthElement: <MouthElement shape={mouthShape} color={mouthColor} />, // Apply mouth color
  };
};

// FaceElement component
const FaceElement: React.FC<{ shape: any; color: string }> = ({
  shape,
  color,
}) => {
  return (
    <rect
      x={shape.svg.x}
      y={shape.svg.y}
      width={shape.svg.width}
      height={shape.svg.height}
      fill={color}
    />
  );
};

// EyesElement component
const EyesElement: React.FC<{ shape: any; color: string }> = ({
  shape,
  color,
}) => {
  return (
    <>
      {shape.svg.map((svgElement: any, index: number) => {
        if (svgElement.type === "ellipse") {
          return (
            <ellipse
              key={index}
              cx={svgElement.cx}
              cy={svgElement.cy}
              rx={svgElement.rx}
              ry={svgElement.ry}
              fill={color}
            />
          );
        }
        if (svgElement.type === "rect") {
          return (
            <rect
              key={index}
              x={svgElement.x}
              y={svgElement.y}
              width={svgElement.width}
              height={svgElement.height}
              fill={color}
            />
          );
        }
        if (svgElement.type === "path") {
          return (
            <path
              key={index}
              d={svgElement.d}
              fill={color} // Apply the color to the path
            />
          );
        }
        return null;
      })}
    </>
  );
};

// HairElement component
const HairElement: React.FC<{ shape: any; color: string }> = ({
  shape,
  color,
}) => {
  return <path d={shape.svg.d} fill={color} />;
};

const MouthElement: React.FC<{ shape: any; color: string }> = ({
  shape,
  color,
}) => {
  if (shape.svg.type === "path") {
    return (
      <path
        d={shape.svg.d}
        stroke={color} // Apply the mouth color
        strokeWidth={shape.svg.strokeWidth}
        fill={shape.svg.fill}
      />
    );
  } else if (shape.svg.type === "line") {
    return (
      <line
        x1={shape.svg.x1}
        y1={shape.svg.y1}
        x2={shape.svg.x2}
        y2={shape.svg.y2}
        stroke={color} // Apply the mouth color
        strokeWidth={shape.svg.strokeWidth}
      />
    );
  }
  return null;
};
