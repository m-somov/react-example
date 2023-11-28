import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export type SearchTextFieldRef = {
  focus(): void;
};

export const SearchTextField = forwardRef<SearchTextFieldRef, Omit<TextFieldProps, 'size' | 'inputRef' | 'fullWidth'>>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement>();

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
      }),
      [],
    );

    return <TextField inputRef={inputRef} {...props} size="small" fullWidth />;
  },
);
