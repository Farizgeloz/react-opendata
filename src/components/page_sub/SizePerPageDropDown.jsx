import React from "react";

const SizePerPageDropDown = ({
  options = [10, 25, 50, 100],
  currSizePerPage = 10,
  onSizePerPageChange = () => {},
}) => {
  return (
    <div className="mb-2 d-flex align-items-center gap-2">
      <label htmlFor="sizePerPageSelect" className="mb-0">
        Tampilkan:
      </label>
      <select
        id="sizePerPageSelect"
        className="form-select form-select-sm w-auto"
        value={currSizePerPage}
        onChange={(e) => onSizePerPageChange(Number(e.target.value))}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="ms-2">data per halaman</span>
    </div>
  );
};

export default SizePerPageDropDown;
