const removeDescriptionPrefix = (description) => {
  return description.split(' - ')[1] ?? description
}

module.exports = removeDescriptionPrefix
