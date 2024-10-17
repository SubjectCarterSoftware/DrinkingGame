import React from "react";

interface AvatarElements {
  faceElement: JSX.Element | null;
  eyesElement: JSX.Element | null;
  mouthElement: JSX.Element | null;
  hairElement: JSX.Element | null;
}

interface DisplayAvatarProps {
  avatarElements: AvatarElements;
}

const DisplayAvatar: React.FC<DisplayAvatarProps> = ({ avatarElements }) => {
  const { faceElement, eyesElement, mouthElement, hairElement } =
    avatarElements;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {faceElement}
      {eyesElement}
      {mouthElement}
      {hairElement}
    </svg>
  );
};

export default DisplayAvatar;
