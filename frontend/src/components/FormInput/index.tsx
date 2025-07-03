import React, { useRef } from 'react';

export default function FormInput(props: any) {
  const { onImageChange, invalid = "false", dirty = "false", onTurnDirty, ...inputProps } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleBlur() {
    onTurnDirty(props.name);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  }

  if (inputProps.type === 'file') {
    return (
      <>
        <input
          type="file"
          {...inputProps}
          onChange={handleFileChange}
          data-invalid={invalid}
          data-dirty={dirty}
          ref={fileInputRef}
        />
        {inputProps.preview && (
          <img
            src={inputProps.preview}
            alt="Preview"
            style={{ maxWidth: '100px', maxHeight: '100px' }}
          />
        )}
      </>
    );
  }

  return (
    <input
      {...inputProps}
      onBlur={handleBlur}
      data-invalid={invalid}
      data-dirty={dirty}
    />
  );
}   