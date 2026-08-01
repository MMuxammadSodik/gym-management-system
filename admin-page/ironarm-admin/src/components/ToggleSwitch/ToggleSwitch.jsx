import React from "react";
import "./ToggleSwitch.css";

function ToggleSwitch({ checked, onChange, disabled = false }) {
    return (
        <label className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="toggle-switch-input"
            />
            <span className="toggle-switch-slider"></span>
        </label>
    );
}

export default ToggleSwitch;
