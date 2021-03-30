import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";

function UserInputComponent({ name, label, variant = "outlined", type = 'text', onChange }) {
    const [value, setValue] = useState("");
    
    return (
        <div>
            <label htmlFor={name}>{name}: </label>
            <TextField
                variant={variant}
                id={name}
                label={label}
                value={value}
                type={type}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                onKeyUp={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
            />
        </div>
    );
};

export { UserInputComponent };