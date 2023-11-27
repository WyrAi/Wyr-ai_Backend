export const HashMethod = (hashInput) => {
  hashInput.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  return hashInput.join("");
};
