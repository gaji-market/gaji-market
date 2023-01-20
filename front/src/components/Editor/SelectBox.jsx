import React from 'react';

export default function SelectBox({
  className,
  disabled,
  onChange,
  required,
  categories,
  optionText,
  optionValue,
  selected,
}) {
  return (
    <>
      <select
        onChange={onChange}
        className={className}
        required={required}
        disabled={disabled}
        value={selected}
      >
        <option value={optionValue}>{optionText}</option>
        {categories?.map((category) => {
          return (
            <option key={category.cateCode} value={category.cateCode}>
              {category.cateName}
            </option>
          );
        })}
      </select>
    </>
  );
}
