import React from "react";

interface Props {
  onFileLoaded: (file: File) => void;
}

const Input: React.FC<Props> = props => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;

    if (files?.length && files[0]) {
      props.onFileLoaded(files[0]);
    }
  }

  return <input type="file" name="file" accept="*" onChange={handleChange} />;
};

export default Input;
